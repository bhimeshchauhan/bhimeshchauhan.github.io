export default [
    {
        id: 13,
        author: "Bhimesh Chauhan",
        panelImageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=400&q=70",
        title: "My Portfolio Assistant Was Retrieving Code. I Measured It, Then Fixed It.",
        tagLine: "Two fixed question sets, one honest correction to my own numbers, and what I found when I finally looked at what my assistant was retrieving.",
        dated: "10th November, 2026 - Canada",
        description: [
            ['h3', "Why I measured"],
            ['p', [
                ['normal', "The assistant on this site answers questions about my work, and I had never measured whether it retrieved the right passages. I wrote a fixed set of 28 recruiter-style questions, each with a piece of text that must appear in the retrieved chunks, such as \"Ask Kindred\" for a question about Rare Days. It is a retrieval check, not an answer-quality check: it tells me whether the right evidence reached the model, not whether the model used it well."]
            ]],
            ['h3', "The baseline"],
            ['p', [
                ['normal', "The right chunk was in the top 3 for 14 of 28 questions (50%) and in the top 10 for 19 (68%). Worse, 74% of everything retrieved looked like code. The trace panel I added to the chat showed passages like an import line for a logo image."]
            ]],
            ['h3', "Two causes"],
            ['p', [
                ['strong', "The index held raw source files. "], ['normal', "My indexer embedded my site's data files as text, in 500-character slices, so most chunks were imports, brackets and file paths rather than sentences about my work."]
            ]],
            ['p', [
                ['strong', "I had misread the threshold. "], ['normal', "The function's match setting is a maximum cosine distance, not a minimum similarity. My 0.75 meant \"similarity at least 0.25\", which let weak matches through. A setting of 0.3 returned nothing at all, which is how I found out."]
            ]],
            ['h3', "The fix"],
            ['p', [
                ['normal', "I rebuilt the index from prose: the profile text, the case studies, the blog and the project list. Each chunk starts with its own context, such as \"Case study: Ask Kindred. Speed, uptime and cost.\", so it makes sense when retrieved alone. The first pass reached 61% in the top 3 and 93% in the top 10, and the two misses taught me something. A generic \"What Bhimesh owned\" chunk was matching unrelated questions, because the search adds my name to every query, so I took the name out of generic labels. And I had packed 13 different requirements into a few large chunks, so I split them to one each."]
            ]],
            ['pairs', {
                title: "The same 28 questions, before and after",
                rows: [
                    { label: "Right chunk in the top 3", before: "50%", after: "93%", beforePct: 50, afterPct: 93 },
                    { label: "Right chunk in the top 10", before: "68%", after: "100%", beforePct: 68, afterPct: 100 },
                    { label: "Retrieved chunks that look like code", before: "74%", after: "0%", beforePct: 74, afterPct: 0 }
                ],
                caption: "Measured on the 28 questions I tuned against, right after re-indexing. After the two fixes below, that set reads 89% and 100%."
            }],
            ['h3', "Then I tightened the settings"],
            ['p', [
                ['normal', "With clean chunks I could ask how few the model needs. A maximum distance of 0.70 with 8 chunks gave the same results as 0.75 with 10, and sends 27% fewer chunks to the model. Tighter than that started losing answers."]
            ]],
            ['bars', {
                title: "Chunks sent to the model across the 28 questions",
                unit: "", max: 260,
                rows: [
                    { label: "0.75, up to 10", value: 244, text: "244 (93% / 100%)" },
                    { label: "0.70, up to 8", value: 177, text: "177 (93% / 100%)" },
                    { label: "0.65, up to 6", value: 122, text: "122 (93% / 93%)" },
                    { label: "0.60, up to 6", value: 90, text: "90 (79% / 79%)" },
                    { label: "0.55, up to 5", value: 57, text: "57 (46% / 46%)" }
                ],
                caption: "Maximum distance and cap, with top-3 and top-k hit rates in brackets. I chose 0.70 and 8."
            }],
            ['h3', "Then I checked on questions I had not tuned against"],
            ['p', [
                ['normal', "Tuning against the same 28 questions flatters the result, so I wrote 30 new ones afterwards, in different phrasing, including informal and misspelled ones, and ran them without changing anything. The right chunk was in the top 3 for 70% and in the top 8 for 90%. That is the number to trust, and it is lower than 93% and 100%."]
            ]],
            ['p', [
                ['normal', "The three misses were informative. Two were missing content: the index had my jobs but no ordered career timeline, so \"what did he do before Rare Days?\" had nothing to match, and the countries I have visited were not indexed at all. I added one chunk for each. The third, a question about how the assistant avoids making things up, is a plain retrieval miss that I have not fixed."]
            ]],
            ['bars', {
                title: "Right chunk retrieved, by question set",
                unit: "%", max: 100,
                rows: [
                    { label: "Tuned set, top 3", value: 93, text: "93%" },
                    { label: "Fresh set, top 3", value: 70, text: "70%" },
                    { label: "Fresh set, top 8", value: 90, text: "90%" },
                    { label: "Fresh, top 8, after two fixes", value: 97, text: "97%" }
                ],
                caption: "The fresh set is 30 questions written after the tuning. The last bar is optimistic, because I fixed the two gaps after seeing them fail. Top-3 ranking slipped to 63% after I added the timeline chunk, which now competes for top spots."
            }],
            ['h3', "Refusing what is not about me"],
            ['p', [
                ['normal', "A fixed question set also told me how the assistant handles things that are not about me. Real questions never scored below 0.415 for their best match, and unrelated ones (weather, trivia, code help, requests to ignore its instructions) scored 0.39 at most, many at zero. That gap is narrow, so I set the cutoff at 0.34, well clear of real questions. Below it the assistant replies with a fixed message and does not call the model at all, which is cheaper and cannot answer from training data. It catches 12 of 16 unrelated questions. The other four are left to a stricter rule in the prompt."]
            ]],
            ['h3', "What this does not show"],
            ['p', [
                ['normal', "Both question sets were written by me, so neither is independent. The check looks for a piece of text in the retrieved chunks, so it cannot tell me whether an answer was good. The index is also rebuilt by a script I run, so it can drift from the site until I run it again."]
            ]],
            ['h3', "What I would tell another team"],
            ['p', [
                ['strong', "Look at what you actually retrieve. "], ['normal', "A chat that sounds fluent hides a bad index. The trace panel is what made the problem visible."]
            ]],
            ['p', [
                ['strong', "Check what a parameter means before you tune it. "], ['normal', "I had been reading a distance as a similarity."]
            ]],
            ['p', [
                ['strong', "Index prose, not source files. "], ['normal', "And give every chunk its own context."]
            ]],
        ]
    },
    {
        id: 9,
        author: "Bhimesh Chauhan",
        panelImageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=70",
        title: "Leading Several Projects at Once: Scope, Time and Stakeholders",
        tagLine: "How I balance what customers ask for, what the timeline allows, and what a team can actually deliver.",
        dated: "5th November, 2026 - Canada",
        description: [
            ['img', "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=75"],
            ['h3', "Three people want three different things"],
            ['p', [
                ['normal', "At Rare Days I lead more than one project at a time, and each one has people pulling in different directions. Customers want more features. The team needs a plan it can really finish. My VP of Engineering, our CTO and our CEO each need to know what will ship and when. Most of the job is holding those three pulls in balance, and this is how I think about it."]
            ]],
            ['h3', "Fix the date, flex the scope"],
            ['p', [
                ['normal', "Customers rarely ask for too much in a single request. Each ask is reasonable on its own. The trouble is the sum of the asks against a date that does not move. So I treat the date as the constraint and the scope as the variable, and I get specific about what has to move, shrink or wait to make room for something new."]
            ]],
            ['p', [
                ['normal', "When a new request arrives, a plain yes or no is rarely the useful answer. The useful answer is what we would trade to fit it in, and what it would cost us if we do not."]
            ]],
            ['h3', "A concrete case: the Jefferson Fisher launch"],
            ['p', [
                ['normal', "The Jefferson Fisher launch was the clearest version of this. I led engineering for the platform behind it: checkout, entitlements and course delivery, with a team of 4 to 5 engineers and designers. The demand was concentrated into a short window, so the plan had to be honest about where limited time would go."]
            ]],
            ['p', [
                ['normal', "Three decisions show the pattern. We put a queue in front of checkout, so a traffic spike degrades gracefully instead of failing payments. We made products database-driven, so offers could change without a redeploy. And we kept an audit trail on bulk entitlement grants, because they change what customers can access. Each one protects the moments that are hard to undo and keeps later changes cheap."]
            ]],
            ['p', [
                ['normal', "The launch generated about "], ['strong', "$700K USD in total sales in under 48 hours"], ['normal', "."]
            ]],
            ['h3', "Keeping stakeholders free of surprises"],
            ['p', [
                ['normal', "With my VP of Engineering, the CTO and the CEO the goal is the same: no surprises. They should hear about a risk from me while there is still time to act on it, not after it has turned into a missed date. Managing expectations is mostly that habit, applied early and repeatedly."]
            ]],
            ['h3', "Running several projects without rebuilding everything"],
            ['p', [
                ['normal', "Leading several projects only works if the work compounds. The ingestion and retrieval capabilities I built for Ask Kindred were reused on other Rare Days projects instead of rebuilt each time, and I mentor engineers on the team so the knowledge does not live in one head. Ask Kindred itself now serves about 200 daily active users across three customer companies."]
            ]],
            ['h3', "What I would tell another lead"],
            ['p', [
                ['strong', "Fix the date and flex the scope. "], ['normal', "Say what you would trade, not just yes or no."]
            ]],
            ['p', [
                ['strong', "Protect the irreversible first. "], ['normal', "Payments, access and data deserve time before polish does."]
            ]],
            ['p', [
                ['strong', "Tell leadership early. "], ['normal', "A risk raised with time to spare is a decision. A risk raised late is a surprise."]
            ]],
        ]
    },
    {
        id: 11,
        author: "Bhimesh Chauhan",
        panelImageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=70",
        title: 'Why I Moved Live Reranking Off My Own Model',
        tagLine: 'I benchmarked a self-hosted reranker against a managed one. The extrapolation I planned around was wrong by a factor of ten.',
        dated: '30th October, 2026 - Canada',
        description: [
            ['h3', 'The plan'],
            ['p', [
                ['normal', 'Retrieval for a chat assistant is two steps: a vector search returns candidate passages, then a reranker reads each one against the question and puts the best first. I wanted a self-hosted reranker (a 149M-parameter cross-encoder, int8 ONNX) because it was cheap. About $6 a month at 30,000 queries on Lambda, against about $60 for a managed reranker.']
            ]],
            ['h3', 'What I assumed and what I measured'],
            ['p', [
                ['normal', "My first estimate came from one measurement on a small container. At 1 vCPU, ten passages took about 7.5 seconds, and 0.25 vCPU took about 28. I extrapolated that a 10 GB Lambda would take about 1.25 seconds. That number was never measured. Our account's Lambda memory ceiling is 3 GB, so the 10 GB option did not exist."]
            ]],
            ['p', [
                ['normal', 'When I measured the real thing on 3 GB, latency depended heavily on passage length. Ten passages of about 40 words took 1.3 seconds. At about 120 words it was 3.1 seconds. At about 400 words, which is our real chunk size, it took 10.5 to 11 seconds.']
            ]],
            ['bars', {
                title: "Rerank time for 10 passages, by passage length",
                unit: "s", max: 12,
                rows: [
                    { label: "~40 words", value: 1.3 },
                    { label: "~120 words", value: 3.1 },
                    { label: "~400 words (our chunk size)", value: 10.8, text: "10.5\u201311s" }
                ],
                marker: { value: 3, label: "3s live timeout" },
                caption: "Measured warm on Lambda at 3 GB, us-east-1, 2026-10-29."
            }],
            ['h3', 'The decision'],
            ['p', [
                ['normal', 'Live chat times out the reranker at 3 seconds. Self-hosted would have timed out on nearly every real request and then fallen through to the managed one anyway, adding 3 seconds to every answer. So the managed reranker became the live path, and the self-hosted one stays for eval runs only, where a 30 second timeout is fine and the cost is zero.']
            ]],
            ['p', [
                ['normal', 'Managed reranking is billed per query, so I gave up the cost advantage knowingly. The estimate was about $60 a month at 30,000 queries, against a time to first token that has to stay under 5 seconds.']
            ]],
            ['h3', 'The fallback matters more than the winner'],
            ['p', [
                ['strong', 'A reranker failure never fails an answer. '],
                ['normal', 'If the managed reranker errors, the answer falls back to the vector search order. It is a little worse and it still answers. A reranker is an optimization on top of retrieval, so it should not be able to take retrieval down.']
            ]],
            ['h3', 'What I would tell another team'],
            ['p', [
                ['strong', 'Benchmark with your real chunk size. '],
                ['normal', 'Latency scaled with passage length, so a test on short strings told me nothing useful.']
            ]],
            ['p', [
                ['strong', 'Label extrapolations as extrapolations. '],
                ['normal', 'The 1.25 second figure sat in a decision table next to measured ones, and it looked like data.']
            ]],
            ['p', [
                ['strong', 'Keep the loser. '],
                ['normal', 'The self-hosted model still earns its place for evals, and the config makes each reranker a per-tenant setting.']
            ]],
        ]
    },
    {
        id: 10,
        author: "Bhimesh Chauhan",
        panelImageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=70",
        title: "Designing a Grounded RAG Assistant: The Choices Behind the Chat on This Site",
        tagLine: "Thresholds, timeouts, token caps and a refusal path: what I decided for the assistant on this portfolio, and what I have not measured yet.",
        dated: "14th September, 2026 - Canada",
        description: [
            ['h3', "Start from what the answer is allowed to say"],
            ['p', [
                ['normal', "The assistant on this site answers questions about my work. The first decision was a boundary: it may use only the retrieved context. The system prompt says so directly, tells the model not to claim experience that is not in the documents, and gives it a fallback line that points the visitor to my email. A grounded assistant that says \"I don't have that\" is more useful to a recruiter than a fluent one that invents a detail."]
            ]],
            ['h3', "The request path"],
            ['p', [
                ['normal', "A question goes to a Supabase edge function. It is embedded with Cohere (embed-english-v3.0), prefixed with the subject so short queries like \"hobbies\" still land near the right chunks. The request asks a pgvector function for the closest chunks, with a maximum cosine distance and a cap on how many come back. (Updated November 2026: I started at 0.75 and 10, and measured my way to 0.70 and 8. The 0.75 was a distance, not a similarity, which I had wrong.) Those chunks, the last five turns of history and the question go to the language model through OpenRouter. The answer is capped at 500 tokens."]
            ]],
            ['steps', [
                ["Question", "last 5 turns of history"],
                ["Embed", "Cohere, 8s timeout"],
                ["Search", "pgvector, closest 8 within distance 0.70"],
                ["Answer", "grounded prompt, 12s timeout, 500 tokens"],
                ["Render", "sanitized in the browser"]
            ]],
            ['h3', "Small guards that carry weight"],
            ['p', [
                ['strong', "Skip retrieval for greetings. "], ['normal', "A pattern check answers \"hi\" without an embedding call or a model call. It saves cost and latency on the cheapest class of request."]
            ]],
            ['p', [
                ['strong', "Time out every network hop. "], ['normal', "The embedding call has an 8 second limit and the model call 12. A slow provider returns an error the UI can handle instead of a hung chat."]
            ]],
            ['p', [
                ['strong', "Keep config in the environment. "], ['normal', "Model, embedding model, match threshold, match count and token cap are environment values, so tuning retrieval does not need a code change."]
            ]],
            ['p', [
                ['strong', "Keep secrets server side. "], ['normal', "Retrieval and model keys live in the edge function. The browser only sends a question and receives text, which it sanitizes before rendering."]
            ]],
            ['h3', "What I have not measured"],
            ['p', [
                ['normal', "I had not measured the retrieval when I wrote this, and when I did it was worse than I assumed. The measurement, the cause and the fix are in the next post up."]
            ]],
            ['h3', "What I would tell another team"],
            ['p', [
                ['strong', "Write the refusal path first. "], ['normal', "Decide what the system says when it does not know before you tune how well it answers."]
            ]],
            ['p', [
                ['strong', "Make tuning knobs configuration. "], ['normal', "Thresholds and caps change often early on."]
            ]],
            ['p', [
                ['strong', "Be honest about what is unmeasured. "], ['normal', "Naming the missing evaluation is the first line of its spec."]
            ]],
        ]
    },
    {
        id: 8,
        author: "Bhimesh Chauhan",
        panelImageUrl: "https://images.unsplash.com/flagged/photo-1574005280900-3ff489fa1f70?auto=format&fit=crop&w=400&q=70",
        title: "Boxing and the Practice of Staying Present",
        tagLine: "A few notes from learning how quickly attention can leave the room.",
        dated: "28th June, 2026 - Vancouver, BC",
        description: [
            ['img', "https://images.unsplash.com/flagged/photo-1574005280900-3ff489fa1f70?auto=format&fit=crop&w=900&q=75"],
            ['h3', "The first few minutes"],
            ['p', [
                ['normal', "I notice how much of my mind arrives somewhere else before the work has even begun. I can be standing still and already arranging the rest of the day, replaying a conversation, or deciding what I should have said. Boxing makes that habit unusually visible because the next instruction comes before I have finished following the last one. In those first few minutes, presence is not a mood I summon so much as a series of small returns."],
            ]],
            ['h3', "A stance to come back to"],
            ['p', [
                ['normal', "The basic instructions are almost reassuringly plain: notice the feet, soften the knees, keep the hands where they need to be, breathe. None of this asks me to become dramatic or fearless. It asks me to feel the weight of my body and the distance in front of me with a little more accuracy. I find that the ordinary details are enough to interrupt a mind that is trying to turn every moment into a larger story."],
            ]],
            ['h3', "What tension reveals"],
            ['p', [
                ['normal', "Tension shows up quickly, and it is difficult to negotiate with once I notice it. A clenched jaw, raised shoulders, or a breath held too high in the chest says more than the explanations I might give myself afterward. I have been thinking about how often I mistake bracing for readiness. In practice, being rigid does not make me more available to what is happening, it only makes each correction feel larger than it is."],
            ]],
            ['h3', "One thing at a time"],
            ['p', [
                ['normal', "There is relief in having only one thing to pay attention to for a moment. If I am working on a particular movement, I do not need to solve the whole session or predict whether I will get it right later. I only need to notice what my body is doing now and make the next attempt a little cleaner. That narrowness feels less like limitation than permission to stop carrying so many unfinished thoughts at once."],
            ]],
            ['h3', "The pause between rounds"],
            ['p', [
                ['normal', "I have come to like the small pause between rounds because it does not ask for a grand interpretation. It is a chance to drink water, let the breathing settle, and notice whether I am carrying frustration from the previous few minutes. Sometimes I am surprised by how quickly a small mistake becomes a private argument in my head. The pause gives me a place to leave that argument behind before it decides the next round for me."],
            ]],
            ['h3', "Being corrected without drama"],
            ['p', [
                ['normal', "Corrections can be simple and specific, which is part of what I appreciate about them. A hand is too low, a foot has drifted, a movement is rushed, and then there is another chance to try. I am used to treating correction as evidence that I have missed something essential about myself. Here it often feels more practical than that, like being reminded to look where I am going."],
            ]],
            ['h3', "Leaving with less noise"],
            ['p', [
                ['normal', "I do not leave with a big lesson, a new identity, or a clean answer about discipline. I leave a little more aware of where my attention went and how gently I can bring it back. The room does not erase the rest of my life, but it gives me a short stretch in which the rest can wait. That seems modest, and lately I find modest things easier to trust."],
            ]],
            ['h3', "When presence slips"],
            ['p', [
                ['normal', "Of course, I do not stay present the whole time, and it would be strange to expect that I could. A thought can pull me away in the middle of something simple, and I can realize a few seconds later that I have been moving without really noticing what I am doing, as though my body had continued while the rest of me stepped into another room. I used to treat that lapse as a failure, as though attention should be held perfectly once it has been found, but that expectation only gives the wandering more power. Now I am more interested in the return itself, in the small choice to notice that I have left and not make a drama out of it. There is something humane in discovering that the mind wandered and choosing, without much ceremony, to come back to the feet, the breath, the distance, and the next instruction."],
            ]],
        ]
    },
    {
        id: 12,
        author: "Bhimesh Chauhan",
        panelImageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=400&q=70",
        title: 'How I Evaluate a RAG Assistant: 55 Questions and Three Rounds of Tuning',
        tagLine: 'What a small fixed question set caught that spot-checking never would, and what it still cannot tell me.',
        dated: '19th March, 2026 - Canada',
        description: [
            ['h3', 'A fixed set beats spot-checking'],
            ['p', [
                ['normal', 'Spot-checking a RAG assistant tells you about the question you happened to type. I wanted the same questions every run, so a change to a prompt, a threshold or the reranker could be compared like for like. The set has 55 queries: 20 on topics the knowledge base covers, 10 that are out of scope (weather, recipes, football), 10 that signal distress, and 5 multi-turn conversations of 15 turns in total.']
            ]],
            ['p', [
                ['normal', 'Each run writes a CSV with time to first token, time spent in embedding, retrieval and reranking, the chunks retrieved, their scores, the model used and whether the answer was a fallback. Domain experts review the answers, so the harness checks routing and grounding and leaves wording to people.']
            ]],
            ['h3', 'Round one: the baseline'],
            ['p', [
                ['normal', 'Seven of ten distress queries were classified correctly. Three were missed: domestic violence, implicit hopelessness and implicit self-harm. Out-of-scope queries took about 6 seconds to get a first token, because the reranker was reading irrelevant passages. Some in-scope questions got "I don\'t have enough information" even though five retrieved passages scored above 0.8.']
            ]],
            ['h3', 'Round two: fix the real causes'],
            ['p', [
                ['normal', 'I widened the distress patterns for the missed phrasings and skipped reranking entirely when the best vector score is below a floor, which took out-of-scope time to first token from about 6 seconds to about 500 milliseconds. I also changed the prompt from "fall back if the context is insufficient" to "share what you can, fall back only if the context is unrelated".']
            ]],
            ['h3', 'Round three: remove the way to fail'],
            ['p', [
                ['normal', 'Two out-of-scope questions ("write a poem", "capital of France") were answered from the model\'s own training data, because the fallback itself called the model and the model ignored the instruction. I replaced it with a fixed message streamed directly, so the fallback path cannot answer anything. I also lowered the vector floor from 0.25 to 0.20 after a real question about night-time wandering scored 0.225 and was wrongly dropped.']
            ]],
            ['h3', 'Where it landed'],
            ['p', [
                ['normal', 'All ten distress queries were classified correctly. All ten out-of-scope queries were refused, with zero grounding violations. 19 of 20 in-scope queries were answered, and 13 of 15 multi-turn turns. The misses are gaps in the corpus, not system faults. Rewriting follow-up questions into standalone queries fixed three of the multi-turn fallbacks, at a cost of 2 to 3 seconds on follow-up turns.']
            ]],
            ['pairs', {
                title: "What three rounds of tuning changed",
                rows: [
                    { label: "Distress queries classified correctly", before: "7 of 10", after: "10 of 10", beforePct: 70, afterPct: 100 },
                    { label: "Out-of-scope time to first token", before: "~6 s", after: "~0.5 s", beforePct: 100, afterPct: 8 },
                    { label: "Out-of-scope questions answered from training data", before: "2 of 10", after: "0 of 10", beforePct: 20, afterPct: 0 }
                ],
                caption: "From the fixed 55-query set, baseline against the final round."
            }],
            ['h3', 'What it cannot tell me'],
            ['p', [
                ['normal', 'Fifty-five questions is a regression net, not a quality guarantee. It says nothing about questions nobody thought to write, and the answers still need expert review. The set only works if production failures are turned into new rows.']
            ]],
            ['h3', 'What I would tell another team'],
            ['p', [
                ['strong', 'Test the refusals as hard as the answers. '],
                ['normal', 'The worst failure was a confident answer to a question the system should have declined.']
            ]],
            ['p', [
                ['strong', 'Fix the path, not the prompt. '],
                ['normal', 'The strongest fix was a code path that cannot call the model, not a firmer instruction.']
            ]],
            ['p', [
                ['strong', 'Keep the numbers beside the change. '],
                ['normal', 'Each tuning round is only legible because the CSV before and after it exists.']
            ]],
        ]
    },
    {
        id: 7,
        author: "Bhimesh Chauhan",
        panelImageUrl: "https://images.unsplash.com/photo-1594768816441-1dd241ffaa67?auto=format&fit=crop&w=400&q=70",
        title: "Horse Riding, Balance, and Trust",
        tagLine: "Learning that balance is more listening than control.",
        dated: "21st February, 2026 - Tokyo, Japan",
        description: [
            ['img', "https://images.unsplash.com/photo-1594768816441-1dd241ffaa67?auto=format&fit=crop&w=900&q=75"],
            ['h3', "A different kind of balance"],
            ['p', [
                ['normal', "I used to think balance meant holding myself perfectly still, as if steadiness were a pose I could achieve and keep. Riding has made it feel more like a conversation made of very small adjustments. The body is never really frozen, and trying to make it so usually creates a new kind of stiffness. What I notice instead is the quieter work of responding before an imbalance has become a problem."],
            ]],
            ['h3', "Listening through the body"],
            ['p', [
                ['normal', "There is a useful humility in paying attention to another body that is larger, alert, and not interested in my private explanations. My mood and movements are not contained inside me once I am riding. A hurried cue, a tense leg, or a distracted posture becomes part of what is being communicated. I find that awareness clarifying because it makes attention less abstract and more considerate."],
            ]],
            ['h3', "The temptation to overcorrect"],
            ['p', [
                ['normal', "When I feel uncertain, my instinct is to do too much and do it quickly. I want to correct every wobble at once, which can turn a small moment of uncertainty into a louder one. The better response is often smaller, slower, and easier to feel. It takes more patience than I expect to wait long enough to learn whether a small adjustment was already enough."],
            ]],
            ['h3', "Trust without certainty"],
            ['p', [
                ['normal', "Trust has not meant assuming everything will go smoothly, or pretending that uncertainty is not there. It has meant showing up carefully enough to respond when something changes. There is a difference between being careless and being willing to stay responsive. I have been thinking about trust as that willingness to keep noticing rather than a promise that nothing uncomfortable will happen."],
            ]],
            ['h3', "The feeling of rhythm"],
            ['p', [
                ['normal', "Some moments have a rhythm that I can only recognize after I stop trying to force them. The movement asks for timing, not just effort, and it is easy to mistake more effort for better timing. When the rhythm feels clearer, I become less preoccupied with whether I look composed. I am simply trying to stay available to what is happening underneath me and around me."],
            ]],
            ['h3', "Room for a beginner's mind"],
            ['p', [
                ['normal', "I do not find the experience neat or instantly intuitive, which may be part of its value. There are many things to remember, and sometimes remembering them all makes me forget the simplest one. I am learning to let not knowing be present without turning it into embarrassment. A beginner's mind is not always charming from the inside, but it can make observation more honest."],
            ]],
            ['h3', "What stays with me"],
            ['p', [
                ['normal', "I keep thinking about how balance depends on attention. It is not a fixed position so much as a conversation that keeps changing, with both sides bringing something to it. The best moments do not feel like control in the usual sense. They feel more like cooperation, which is quieter and more demanding than I first assumed."],
            ]],
            ['h3', "Care as a form of attention"],
            ['p', [
                ['normal', "What stays with me most is the sense that care is visible before it is explained, often in choices so small that they would be easy to overlook from the ground or dismiss as ordinary. It appears in how closely I pay attention, how willingly I slow down, and whether I keep treating the other body as a partner with its own signals rather than a piece of equipment for my own learning, especially when I feel preoccupied. That is not a sentimental thought for me, because the relationship is practical before it becomes poetic, and it asks for consistency rather than a good intention held at a distance or a feeling I can claim once. It is a practical one because impatience has a texture and so does respect, and both seem to travel through posture, pace, and the pressure of a cue, even when I believe I am hiding them. Riding makes those textures easier to feel, and I find that useful even when I am still learning what to do with them and even when I cannot name the whole lesson cleanly under the pressure of a real moment without turning it into a rule."],
            ]],
        ]
    },
    {
        id: 6,
        author: "Bhimesh Chauhan",
        panelImageUrl: "https://images.unsplash.com/photo-1422246358533-95dcd3d48961?auto=format&fit=crop&w=400&q=70",
        title: "Learning to Think With My Hands Through Sculpting",
        tagLine: "Notes on making room for material, friction, and surprise.",
        dated: "9th October, 2025 - Mumbai, India",
        description: [
            ['img', "https://images.unsplash.com/photo-1422246358533-95dcd3d48961?auto=format&fit=crop&w=900&q=75"],
            ['h3', "Before there is a plan"],
            ['p', [
                ['normal', "I am used to beginning with words, outlines, and a sense that I should know what I mean before I start. Working with material asks me to begin by looking, touching, and waiting a little longer. The first information is often not an idea but a weight, a texture, or the way a surface catches the light. I find that shift both disorienting and relieving because it makes room for thought that has not yet found a sentence."],
            ]],
            ['h3', "The resistance matters"],
            ['p', [
                ['normal', "A surface that will not do exactly what I expect can be frustrating at first. It can also point toward a shape I would not have imagined if I were only looking at a screen or a sketch. The material has its own limits, and those limits are not merely obstacles to get around. Sometimes they are the only reason I pause long enough to see a different possibility."],
            ]],
            ['h3', "Small decisions"],
            ['p', [
                ['normal', "The work seems to move through tiny choices: add, remove, turn, smooth, roughen, or leave it alone. Each one feels modest in isolation, but together they change the whole thing. I have been struck by how quickly a small mark can alter the balance of a form. It makes me less interested in dramatic gestures and more attentive to the consequence of the next small decision."],
            ]],
            ['h3', "Letting it be awkward"],
            ['p', [
                ['normal', "I am learning not to rush past the clumsy stage. Sometimes the awkward part is simply evidence that my hands are still finding their way, not proof that the work has failed. It is tempting to smooth over uncertainty because a clean surface can look like progress. But I find that an early awkwardness sometimes contains more life than the version I would make by trying to tidy everything too soon."],
            ]],
            ['h3', "Looking from different sides"],
            ['p', [
                ['normal', "A form changes when I walk around it, and that fact feels almost embarrassingly obvious until I experience it. What looks complete from one angle can become thin, heavy, or unresolved from another. I do not mean this as a lesson about everything else in life. I only notice that changing my position is sometimes more useful than staring harder at the same problem."],
            ]],
            ['h3', "The value of stopping"],
            ['p', [
                ['normal', "There are moments when the most useful action is to stop touching the work. That can feel passive, especially when I want an answer from the material right away. A pause lets the last change become visible instead of being buried under the next one. It also gives me a chance to ask whether I am responding to what is there or only to the discomfort of waiting."],
            ]],
            ['h3', "A slower kind of thought"],
            ['p', [
                ['normal', "Sculpting gives me a way to think that is less tidy than a sentence and less eager to arrive at a conclusion. I do not need to name every decision for it to matter. The hands can hold a question for a while, revise it, and make it visible without fully resolving it. I find that reassuring, especially when I do not yet know what I mean."],
            ]],
            ['h3', "What remains unfinished"],
            ['p', [
                ['normal', "I am drawn to the point when a piece seems finished enough to stand on its own but still carries evidence of its making, including the small uncertainties and revisions that brought it there. A perfectly resolved surface can be beautiful, yet I also like seeing the record of a hand changing its mind, pressing too hard, taking something away, or deciding that a previous mark should remain. The unfinished quality is not always a mistake or a lack of care, and I do not think it needs to be defended as a virtue every time it appears. Sometimes it is simply the part that keeps the work open to another look, because it has not closed every door behind the viewer. I have been thinking about how much I value that openness when I let myself stop asking for a final answer too quickly or treating uncertainty as a problem that must immediately be hidden from view, smoothed away, or explained before it has taught me anything."],
            ]],
        ]
    },
    {
        id: 5,
        author: "Bhimesh Chauhan",
        panelImageUrl: "https://images.unsplash.com/photo-1775343970376-3bb5fd1171b6?auto=format&fit=crop&w=400&q=70",
        title: "Klimt and the Courage to Make Work That Is Too Much",
        tagLine: "What I notice when decoration refuses to apologize.",
        dated: "17th June, 2025 - Mexico City, Mexico",
        description: [
            ['img', "https://images.unsplash.com/photo-1775343970376-3bb5fd1171b6?auto=format&fit=crop&w=900&q=75"],
            ['h3', "Looking for the edges"],
            ['p', [
                ['normal', "When I look at Klimt, I keep noticing how much is allowed to happen at once. Pattern, gold, faces, ornament, and flatness all seem to make room for one another without agreeing to become simple. My eye keeps moving because there is no single, tidy place to settle. I have been thinking about that abundance not as decoration piled on top of an image, but as part of the image's way of asking to be looked at."],
            ]],
            ['h3', "My instinct to edit"],
            ['p', [
                ['normal', "I often trust restraint because it feels safe, legible, and easy to defend. These paintings make me wonder when restraint is clarity and when it is simply hesitation wearing a cleaner outfit. There are times when taking something away reveals what matters. There are also times when removing the strange, dense, or excessive part only makes the work less willing to tell the truth about its own appetite."],
            ]],
            ['h3', "Decoration as attention"],
            ['p', [
                ['normal', "The detail does not feel like an afterthought to me. It feels like a record of someone staying with a surface long enough to keep seeing more in it, even after a quicker version might have seemed finished. I find myself looking at repeating shapes and wondering how repetition changes when it is made with real attention. It can become less like filler and more like a rhythm that keeps the eye awake."],
            ]],
            ['h3', "Pleasure and discomfort"],
            ['p', [
                ['normal', "Some parts draw me in while others make me pull back, and I like that I do not have to choose a single clean response. Beauty can be immediate, but it can also feel withholding or a little too close. The ornate surface does not erase the faces at its center, and the faces do not make the surface behave. That unresolved relationship is part of why I keep returning to the work in my mind."],
            ]],
            ['h3', "A different kind of flatness"],
            ['p', [
                ['normal', "I am interested in the way flatness can still feel layered. A patterned field may seem to press forward while a face appears quiet inside it, and the space becomes less like a window than a surface with its own gravity. I do not have the vocabulary of an art historian for all of this. I only know that the arrangement slows my looking down because it refuses to give depth in the usual, comfortable way."],
            ]],
            ['h3', "Attention takes time"],
            ['p', [
                ['normal', "The more I look, the less useful a quick verdict becomes. I might first call something beautiful, busy, excessive, or strange, but none of those words has much patience in it. Attention changes what I can see because it makes room for a second and third impression. I have been trying to value that longer looking without pretending it always leads to certainty."],
            ]],
            ['h3', "Permission to notice excess"],
            ['p', [
                ['normal', "I leave with a renewed respect for work that risks being too ornate, too intimate, or too strange. Excess can be empty, of course, but it can also carry feeling that restraint would flatten. What I take from Klimt is not permission to add more to everything. It is a reminder to ask whether my urge to simplify comes from discernment or from fear of being seen wanting too much."],
            ]],
            ['h3', "Looking again"],
            ['p', [
                ['normal', "Looking again is different from merely looking longer, because it asks me to give up the small confidence of a first impression. The first glance can be dazzled by the gold or caught by the most obvious figure, while the next glance begins to notice how many decisions are quietly holding the composition together and how those decisions move the eye away from the obvious center. I do not need to solve those decisions to feel their effect, or to turn them into an argument about what the painting finally means. It is enough to recognize that my first response was partial and that the painting has not run out of things to say after I have used up my quickest description of it. That possibility makes the experience feel generous without making it easy, which is one of the forms of generosity I value most in art."],
            ]],
        ]
    },
    {
        id: 4,
        author: "Bhimesh Chauhan",
        panelImageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=70",
        title: "What Music Has Taught Me About Attention",
        tagLine: "A few small observations about listening all the way through.",
        dated: "13th February, 2025 - Peru",
        description: [
            ['img', "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=75"],
            ['h3', "The urge to skip ahead"],
            ['p', [
                ['normal', "I catch myself wanting the familiar part of a song before it arrives. Sometimes I want the chorus, sometimes the line I already know, and sometimes I only want the feeling I associate with it. Listening has made that impatience easier to spot. The beginning of a song can seem like an obstacle when I have already decided which moment is supposed to matter."],
            ]],
            ['h3', "Hearing the room around it"],
            ['p', [
                ['normal', "A track can change when I notice the space around a voice, the small sound at the end of a phrase, or an instrument that has been there quietly all along. There is often more happening than I first hear because I tend to follow the loudest or most familiar thing. I find that a second listen is not simply repetition. It is a chance to let a different detail become the center for a while."],
            ]],
            ['h3', "Repetition is not empty"],
            ['p', [
                ['normal', "The same song can meet me differently on different days. The song stays put, but my attention brings a different weather to it, and that changes what seems important. A melody I once passed over can suddenly feel like the whole reason to return. I have been thinking about how repetition can reveal change, even when the object of attention has not changed at all."],
            ]],
            ['h3', "Letting a pause remain a pause"],
            ['p', [
                ['normal', "I like the moments where nothing rushes in to fill the space. A pause, a breath, or a held note can make the next sound feel less automatic, as if it has been given room to arrive. I notice how quickly I want that space to be filled when I am distracted. When I let it remain a pause, the silence starts to feel like part of the music rather than an absence inside it."],
            ]],
            ['h3', "Mood is part of the room"],
            ['p', [
                ['normal', "I do not arrive at music as a blank listener. A tired day, a restless morning, or a quiet evening changes what I hear and what I need from it. That does not make the listening less real. It makes it more honest to admit that the room inside me is part of the experience too."],
            ]],
            ['h3', "Listening without collecting"],
            ['p', [
                ['normal', "There is an impulse to turn every song into something I should rank, recommend, understand, or attach to a larger story. I am trying to leave a little space between hearing something and making use of it. Some music can simply accompany a walk, a meal, or a moment of looking out a window. I find that this kind of listening has its own value precisely because it does not need to prove anything."],
            ]],
            ['h3', "Listening as a small practice"],
            ['p', [
                ['normal', "I do not always listen carefully, and that is fine. But when I do, it reminds me that attention can be quiet, ordinary, and enough for a few minutes. I am not trying to become a better listener in any heroic sense. I only want to notice when I have rushed past something that was already asking to be heard."],
            ]],
            ['h3', "The end of a song"],
            ['p', [
                ['normal', "I am often surprised by how quickly I move on when a song ends, as though its final seconds were only a signal to begin choosing the next thing from an endless shelf. Another track begins, a notification appears, or I reach for something else before the last sound has fully disappeared and before I have noticed what the ending changed in the room around me. Sometimes I try to wait for a few seconds instead, not as a rule but as a way of letting the song finish on its own terms and allowing my response to arrive after it. The silence afterward is not profound, but it lets the song keep its shape for a moment before it becomes part of a stream of other things competing for my attention, each asking to be chosen quickly. I find that small delay helps me hear the ending as an ending, rather than as the brief gap before I ask for more, and it makes the next sound feel slightly less inevitable and more like a new arrival with its own small demands."],
            ]],
        ]
    },
    {
        id: 3,
        author: "Bhimesh Chauhan",
        panelImageUrl: "https://images.unsplash.com/photo-1712246754649-119c1cef4a43?auto=format&fit=crop&w=400&q=70",
        title: "Fine-Tuning LLMs for Domain-Specific Applications",
        tagLine: "In this blog, I’ll walk you through the basics of fine-tuning LLMs and explain the steps required to make them more effective for specific tasks.",
        dated: "14th September, 2024 - Toronto, CA",
        description: [
            ['img', "https://cdn-images-1.medium.com/max/900/1*2mzg61san4ffmVmN_0fP_Q.png"],
            ['h3', "What is Fine-Tuning?"],
            ['p', [
                ['em', "Fine-tuning involves adjusting the parameters of a pre-trained language model on new, specialized data."],
            ]],
            ['p', [
                ['normal', "Pre-trained models like GPT or BERT are trained on large datasets containing general information, but they may not perform well on niche topics like medical diagnoses or legal cases. Fine-tuning helps tailor these models to excel in specific domains."],
            ]],
            ['pre', [
                ['normal', 'const fineTuneModel = async (dataset) => {'],
                ['br', 'br'],
                ['normal', '  const model = await loadPretrainedModel("gpt-3.5-turbo");'],
                ['br', 'br'],
                ['normal', '  model.train(dataset, { epochs: 5 });'],
                ['br', 'br'],
                ['normal', '  return model;'],
                ['br', 'br'],
                ['normal', '};'],
                ['br', 'br'],
                ['normal', 'const medicalModel = fineTuneModel(medicalData);'],
                ['br', 'br'],
                ['strong', '// Model fine-tuned on medical notes'],
            ]],
            ['p', [
                ['strong', "Fine-tuning helps overcome generalization issues."],
                ['normal', " When LLMs are fine-tuned, they become more focused and relevant for specific queries, improving their performance on tasks related to the target domain."]
            ]],
            ['blockquote', "Let’s dive deeper into why fine-tuning matters for real-world use cases."],
            ['p', [
                ['normal', "Think of fine-tuning as adjusting a generic recipe to suit your specific taste. You retain the original recipe's structure but make changes to align with your personal preferences."]
            ]],
            ['p', [
                ['normal', "Example 1: A financial assistant chatbot fine-tuned on recent market trends can provide better advice compared to a general-purpose model."],
            ]],
            ['p', [
                ['normal', "Example 2: A customer support bot tailored to your business responds accurately to common issues and inquiries, reducing response time and improving customer satisfaction."],
            ]],
            ['hr', "hr"],
            ['h3', "How to Fine-Tune an LLM?"],
            ['p', [
                ['normal', "Fine-tuning can be broken down into a few key steps:"]
            ]],
            ['h4', "1. Data Preparation"],
            ['p', [
                ['normal', "Collect and clean your dataset. Ensure the text is properly formatted and labeled if necessary. For example, if you're fine-tuning on medical notes, each record should contain consistent terminology and structure."]
            ]],
            ['h4', "2. Model Loading"],
            ['p', [
                ['normal', "Start by loading a pre-trained model, like GPT or BERT, from a model hub or library."],
                ['code', "const model = await loadPretrainedModel('bert-base');"]
            ]],
            ['h4', "3. Training the Model"],
            ['p', [
                ['normal', "Feed your specialized data into the model using your preferred framework (e.g., PyTorch, TensorFlow). Make sure to adjust hyperparameters, like the learning rate, to avoid overfitting."],
                ['code', "model.train(data, { batchSize: 16, epochs: 3 });"]
            ]],
            ['h4', "4. Evaluating and Fine-Tuning"],
            ['p', [
                ['normal', "Evaluate the fine-tuned model's performance using metrics like accuracy or F1-score. Continue adjusting the parameters as needed."]
            ]],
            ['blockquote', "Remember: A good fine-tuning process requires careful evaluation to ensure the model generalizes well to unseen data."],
            ['hr', "hr"],
            ['h3', "Applications of Fine-Tuning"],
            ['p', [
                ['normal', "Fine-tuning LLMs opens up a world of possibilities:"]
            ]],
            ['h4', "Healthcare"],
            ['p', [
                ['normal', "A fine-tuned LLM can assist doctors by summarizing patient records and providing recommendations based on the latest research."]
            ]],
            ['h4', "Finance"],
            ['p', [
                ['normal', "In the finance industry, LLMs fine-tuned on stock data can generate accurate reports and forecasts."]
            ]],
            ['h4', "Legal Advice"],
            ['p', [
                ['normal', "LLMs trained on legal documents can assist in drafting contracts and answering legal questions with precise language."]
            ]],
            ['hr', "hr"],
            ['h3', "Key Benefits of Fine-Tuning"],
            ['p', [
                ['strong', "1. Increased Accuracy:"],
                ['normal', " Models become more reliable for specific tasks and queries."]
            ]],
            ['p', [
                ['strong', "2. Faster Response:"],
                ['normal', " Tailored models provide answers more efficiently, improving user satisfaction."]
            ]],
            ['p', [
                ['strong', "3. Reduced Hallucination:"],
                ['normal', " By focusing on relevant data, fine-tuned models are less likely to produce misleading information."]
            ]],
            ['p', [
                ['normal', "Fine-tuning is essential for LLMs to reach their full potential in real-world applications."]
            ]]
        ]
    }

,
    {
        id: 2,
        author: "Bhimesh Chauhan",
        panelImageUrl: "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?auto=format&fit=crop&w=400&q=70",
        title: "Implementing Retrieval-Augmented Generation (RAG) with LLMs",
        tagLine: "In this post, we’ll explore how RAG enhances Large Language Models (LLMs) by integrating real-time data retrieval, using simple examples to illustrate the process.",
        dated: "22nd July, 2024 - Toronto, CA",
        description: [
            ['img', "https://cdn-images-1.medium.com/v2/resize:fit:900/format:webp/1*nsCTjifxfS_fTm9_lx_AuA.png"],
            ['h3', "What is Retrieval-Augmented Generation (RAG)?"],
            ['p', [
                ['em', "RAG combines the power of LLMs with external knowledge retrieval."],
            ]],
            ['p', [
                ['normal', "Instead of relying entirely on pre-trained knowledge, RAG retrieves relevant information from a connected source (like a database or API) and augments the response of the LLM in real-time."],
            ]],
            ['pre', [
                ['normal', 'async function getAnswer(query) {'],
                ['br', 'br'],
                ['normal', '  const documents = await retrieveRelevantDocs(query);'],
                ['br', 'br'],
                ['normal', '  const prompt = buildPrompt(query, documents);'],
                ['br', 'br'],
                ['normal', '  return await llm.generate(prompt);'],
                ['br', 'br'],
                ['normal', '}'],
                ['br', 'br'],
                ['br', 'br'],
                ['normal', 'getAnswer("What are the symptoms of diabetes?");'],
                ['br', 'br'],
                ['strong', '// Returns accurate and current medical information']
            ]],
            ['p', [
                ['strong', "This method helps overcome some limitations of LLMs."],
                ['normal', " LLMs may not have up-to-date information, but with RAG, the model retrieves data on-the-fly from external sources to enhance the response."]
            ]],
            ['blockquote', "Let’s dive deeper into why RAG is useful and how it complements LLMs."],
            ['p', [
                ['normal', "Think of RAG as a way to keep the LLM's answers accurate and relevant even after the model has been deployed."]
            ]],
            ['p', [
                ['normal', "Example 1: A legal advice chatbot retrieves the latest regulations to provide accurate responses."],
            ]],
            ['p', [
                ['normal', "Example 2: A medical assistant fetches recent journal publications when asked about new treatments."],
            ]],
            ['p', [
                ['normal', "These examples show how RAG ensures that AI applications stay relevant in dynamic fields."],
            ]],
            ['hr', "hr"],
            ['h3', "How Does RAG Work?"],
            ['p', [
                ['normal', "RAG involves three main components:"]
            ]],
            ['h4', "1. Query and Document Retrieval"],
            ['p', [
                ['normal', "When a user makes a request, the query is sent to a document store or external API to retrieve relevant data. Think of it as searching through a library to find the best books for your topic."]
            ]],
            ['h4', "2. Augmenting the Prompt"],
            ['p', [
                ['normal', "The retrieved documents are embedded into the LLM prompt, enhancing its response with external knowledge. This step ensures the response is not just based on the model's pre-trained data."],
                ['code', "const prompt = buildPrompt(userQuery, retrievedDocs);"],
            ]],
            ['h4', "3. Generating the Response"],
            ['p', [
                ['normal', "Finally, the LLM generates a response based on the augmented prompt, producing accurate and contextual answers."],
                ['code', "return llm.generate(prompt);"],
            ]],
            ['p', [
                ['normal', "RAG ensures that the model provides fact-based answers, even when it didn’t originally know the information."]
            ]],
            ['blockquote', "The retrieval step ensures that the AI isn't guessing or 'hallucinating' answers."],
            ['p', [
                ['normal', "Example: Instead of relying on old data, a travel assistant fetches live flight statuses to assist users."]
            ]],
            ['p', [
                ['normal', "This prevents outdated information from slipping through."]
            ]],
            ['hr', "hr"],
            ['h3', "Applications of RAG with LLMs"],
            ['p', [
                ['normal', "Here are some common use cases where RAG with LLMs shines:"]
            ]],
            ['h4', "Customer Support Bots"],
            ['p', [
                ['normal', "Bots can fetch relevant knowledge base articles to solve user queries faster and more accurately."]
            ]],
            ['h4', "Medical Assistants"],
            ['p', [
                ['normal', "LLMs with RAG integration pull the latest medical research to provide informed recommendations during consultations."]
            ]],
            ['h4', "Legal Research"],
            ['p', [
                ['normal', "A legal AI assistant retrieves recent case law or statutes to answer complex legal questions accurately."]
            ]],
            ['hr', "hr"],
            ['h3', "Benefits of RAG"],
            ['p', [
                ['strong', "1. Real-time Relevance:"],
                ['normal', " Ensures that responses are always up-to-date with the latest information."]
            ]],
            ['p', [
                ['strong', "2. Reduced Hallucination:"],
                ['normal', " By grounding responses in real data, it minimizes the chances of incorrect or fabricated answers."]
            ]],
            ['p', [
                ['strong', "3. Enhanced Utility:"],
                ['normal', " Makes LLMs suitable for use in dynamic environments like healthcare, finance, and law."]
            ]],
            ['p', [
                ['normal', "With RAG, applications powered by LLMs are more powerful, accurate, and trustworthy."]
            ]]
        ]
    },
    {
        id: 1,
        author: "Bhimesh Chauhan",
        panelImageUrl: "https://images.unsplash.com/photo-1574505324536-bdb84f668114?auto=format&fit=crop&w=400&q=70",
        title: "Learn and Understand Recursion in JavaScript",
        tagLine: "I’ll walk you through two popular JS recursion examples in 10 minutes so you can finally understand how recursion works in JavaScript.",
        dated: "12th January, 2020 - Boston, MA",
        description: [
            ['img', "https://cdn-images-1.medium.com/max/900/1*DkkJtUJr6f4H0HXD_3A0sQ.jpeg"],
            ['h3', "What is Recursion?"],
            ['p', [
                ['em', "Recursion is simply when a function calls itself."],
            ]],
            ['p', [
                ['normal', "Lets jump right in and take a look at probably the most famous recursion example. This example returns the factorial of a supplied integer:"],
            ]],
            ['pre', [
                ['normal', 'function factorial(x) {'],
                ['br', 'br'],
                ['normal', '  if (x &lt; 0) return;'],
                ['br', 'br'],
                ['normal', '  if (x === 0) return 1;'],
                ['br', 'br'],
                ['normal', '  return x * factorial(x - 1);'],
                ['br', 'br'],
                ['normal', '}'],
                ['br', 'br'],
                ['br', 'br'],
                ['normal', 'factorial(3);'],
                ['br', 'br'],
                ['strong', '// 6'],
            ]],
            ['p', [
                ['strong', "Woah. It’s Okay if that makes no sense to you."],
                ['normal', "The important part is happening on line 4:"],
                ['code', "return x * factorial(x — 1);"],
                ['normal', ". As you can see, the function is actually calling itself again ("],
                ['code', "factorial(x-1)"],
                ['normal', "), but with a parameter that is one less than when it was called the first time. This makes it a recursive function."]
            ]],
            ['blockquote', "Before I break down that code example any further, it’s important you understand what factorials are."],
            ['p', [
                ['normal', "To get the factorial of a number you multiply that number by itself minus one until you reach the number one."]
            ]],
            ['p', [
                ['normal', "Example 1: The factorial of 4 is 4 * 3 * 2 * 1, or "],
                ['strong', "24"],
                ['normal', "."]
            ]],
            ['p', [
                ['normal','"Example 2: The factorial of 2 is just 2 * 1, or "'],
                ['strong', "2"],
                ['normal', "."]
            ]],
            ['p', [
                ['normal', "Awesome, now that our High School Math lesson is over, we can return to the good stuff!"]
            ]],
            ['hr', "hr"],
            ['h3', "The three key features of recursion"],
            ['p', [
                ['normal', "All recursive functions should have three key features:"]
            ]],
            ['h4', "A Termination Condition"],
            ['p', [
                ['normal', "Simply put: "],
                ['code', "if(something bad happend)[ STOP };"],
                ['normal', " The Termination Condition is our recursion fail-safe. Think of it like your emergency brake. It’s put there in case of bad input to prevent the recursion from ever running. In our factorial example, if"],
                ['code', "(x &lt; 0) return;"],
                ['normal', "is our termination condition. It’s not possible to factorial a negative number and thus, we don’t even want to run our recursion if a negative number is input."]
            ]],
            ['h4', "A Base Case"],
            ['p', [
                ['normal', "Simply put: "],
                ['code', "if(this happens) [ Yay! We're done };"],
                ['normal', " The Base Case is similar to our termination condition in that it also stops our recursion. But remember, the termination condition is a catch-all for bad data. Whereas the base case is the goal of our recursive function. Base cases are usually within an if statement. In the factorial example, if"],
                ['code', "(x === 0) return 1;"],
                ['normal', " is our base case. We know that once we’ve gotten x down to zero, we’ve succeeded in determining our factorial!"],
            ]],
            ['p', [
                ['normal', "Simply put: Our function calling itself. In the factorial example,"],
                ['code', "return x * factorial(x — 1);"],
                ['normal', " is where the recursion actually happens. We’re returning the value of the number x multiplied by the value of whatever"],
                ['code', "factorial(x-1)"],
                ['normal', "evaluates to."]
            ]]
        ]
    }
];
