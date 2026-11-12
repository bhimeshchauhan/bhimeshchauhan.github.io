import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import Layout from "../components/layout";
import results from "../data/retrieval-results.json";

const display = `"Space Grotesk", "Inter", sans-serif`;
const REPO = "https://github.com/bhimeshchauhan/bhimeshchauhan.com/blob/dev";

const Wrap = styled.div`
  margin: 2rem auto 0;
  max-width: 1040px;
  h1 { color: var(--ink); font-family: ${display}; font-size: clamp(2.4rem, 6vw, 4.5rem); font-weight: 700; letter-spacing: -0.04em; line-height: 1; margin: 0 0 1rem; }
  .lede { color: var(--muted); font-size: clamp(1.05rem, 2vw, 1.3rem); line-height: 1.6; margin: 0 0 2.5rem; max-width: 46rem; }
  h2 { color: var(--accent); font-size: 0.8rem; letter-spacing: 0.1em; margin: 0 0 1rem; text-transform: uppercase; }
  section { border-top: 1px solid var(--line); margin-top: 2.5rem; padding-top: 1.75rem; }
  p, li { color: #d9d7d0; line-height: 1.7; max-width: 46rem; }
  a { color: var(--accent); }
`;

const Figures = styled.ul`
  display: grid;
  gap: 1.75rem 2rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  list-style: none;
  margin: 0 0 2rem;
  padding: 0;
  @media (max-width: 900px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
  li { border-left: 2px solid var(--accent); margin: 0; padding: 0.1rem 0 0.1rem 1rem; }
  strong { color: var(--ink); display: block; font-family: ${display}; font-size: clamp(1.9rem, 4vw, 2.8rem); letter-spacing: -0.03em; line-height: 1.1; }
  small { color: var(--muted); display: block; font-size: 0.92rem; line-height: 1.45; margin-top: 0.3rem; }
`;

const Facts = styled.dl`
  display: grid;
  gap: 0.6rem 2rem;
  grid-template-columns: 11rem minmax(0, 1fr);
  margin: 0;
  @media (max-width: 600px) { grid-template-columns: 1fr; gap: 0; dd { margin-bottom: 0.7rem; } }
  dt { color: var(--muted); }
  dd { color: var(--ink); margin: 0; }
`;

const Table = styled.table`
  border-collapse: collapse;
  font-size: 0.95rem;
  margin-top: 0.75rem;
  width: 100%;
  caption { color: var(--muted); font-size: 0.85rem; padding-bottom: 0.5rem; text-align: left; }
  th, td { border-bottom: 1px solid var(--line); padding: 0.55rem 0.5rem; text-align: left; vertical-align: top; }
  th { color: var(--muted); font-weight: 500; }
  td { color: #d9d7d0; }
  td.res, td.num { white-space: nowrap; }
  td.num { color: var(--muted); font-variant-numeric: tabular-nums; }
  .ok { color: var(--ink); }
  .bad { color: var(--accent); }
`;

const Set = styled.details`
  border: 1px solid var(--line);
  border-radius: 8px;
  margin-top: 1rem;
  padding: 0 1rem;
  summary { color: var(--ink); cursor: pointer; font-weight: 600; padding: 0.9rem 0; }
  summary span { color: var(--muted); font-weight: 400; }
  &[open] { padding-bottom: 1rem; }
`;

const pct = (a, n) => Math.round((100 * a) / n);
const total = Object.values(results.index).reduce((a, b) => a + b, 0);
const sources = Object.entries(results.index).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k.replace("_", " ")} ${v}`).join(", ");
const { main, holdout, refusal, settings } = results;

const InScope = ({ title, note, set }) => (
  <Set>
    <summary>
      {title} <span>· {set.n} questions · {set.hitk} found in the top {settings.chunks_per_question}, {set.hit3} in the top 3</span>
    </summary>
    <p>{note}</p>
    <Table>
      <caption>{title}</caption>
      <thead><tr><th>Question</th><th>Result</th><th>Best match</th></tr></thead>
      <tbody>
        {set.questions.map((q) => (
          <tr key={q.q}>
            <td>{q.q}</td>
            <td className={`res ${q.topk ? "ok" : "bad"}`}>{q.top3 ? "In the top 3" : q.topk ? `In the top ${settings.chunks_per_question}` : "Missed"}</td>
            <td className="num">{q.best.toFixed(3)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Set>
);

const Evidence = () => (
  <Layout
    seo={{
      title: "Evidence: measured retrieval quality",
      description: `How well the assistant on this site retrieves the right answer, measured against fixed question sets: ${holdout.hitk} of ${holdout.n} found on questions it was never tuned on.`,
      pathname: "/evidence/",
      image: "/og/evidence.jpg",
      imageAlt: `Evidence: ${pct(holdout.hitk, holdout.n)}% retrieval on questions the assistant was never tuned on`
    }}
  >
    <Wrap>
      <h1>Evidence</h1>
      <p className="lede">
        The assistant on this site answers from a search index of my work. Here is how well that search finds the right passage, measured by a script in this repository against the live index, with the questions and the misses published.
      </p>

      <Figures aria-label="Headline results">
        <li><strong>{holdout.hitk} of {holdout.n}</strong><small>fresh questions where the right passage was retrieved ({pct(holdout.hitk, holdout.n)}%), on a set I never tuned against</small></li>
        <li><strong>{holdout.hit3} of {holdout.n}</strong><small>of those had it in the top 3 ({pct(holdout.hit3, holdout.n)}%): ranking is weaker than retrieval</small></li>
        <li><strong>{refusal.refused} of {refusal.n}</strong><small>unrelated questions refused by the cutoff alone, with no model call. The other {refusal.n - refusal.refused} are left to a prompt rule</small></li>
        <li><strong>{holdout.code_like_pct}%</strong><small>of retrieved chunks look like code (74% before I re-indexed from prose)</small></li>
      </Figures>

      <section>
        <h2>What was measured</h2>
        <Facts>
          <dt>Measured on</dt><dd>{results.generated}</dd>
          <dt>Index</dt><dd>{total} chunks: {sources}</dd>
          <dt>Retrieval settings</dt><dd>closest {settings.chunks_per_question} chunks within a cosine distance of {settings.max_distance}</dd>
          <dt>Refusal cutoff</dt><dd>best match below {settings.refusal_cutoff} gets a fixed reply and no model call</dd>
          <dt>How a hit is judged</dt><dd>each question lists text that must appear in the retrieved chunks, so it shows that the right evidence reached the model, not that the answer was good</dd>
        </Facts>
      </section>

      <section>
        <h2>The questions</h2>
        <p>Three sets, all written by me. The first was used to tune the chunking, so its numbers flatter the system. The second was written afterwards and never tuned against, so it is the number to trust.</p>
        <InScope title="Tuned against" note={`The set I tuned the chunking against: ${pct(main.hitk, main.n)}% found, ${pct(main.hit3, main.n)}% in the top 3. Treat as optimistic.`} set={main} />
        <InScope title="Fresh questions, never tuned against" note="Written after the tuning, in different phrasing, including informal and misspelled questions. I fixed two content gaps it exposed (a career timeline and the places I have visited), so the one remaining miss is the honest one." set={holdout} />
        <Set>
          <summary>
            Unrelated questions <span>· {refusal.n} questions · {refusal.refused} refused by the cutoff</span>
          </summary>
          <p>Weather, trivia, code help and requests to ignore instructions. Real questions never scored below {Math.min(main.lowest_best, holdout.lowest_best).toFixed(3)} for their best match, and these scored at most {refusal.highest_best.toFixed(3)}, so the cutoff sits in a narrow gap. Questions it does not catch are handled by a rule in the prompt.</p>
          <Table>
            <caption>Unrelated questions</caption>
            <thead><tr><th>Question</th><th>Result</th><th>Best match</th></tr></thead>
            <tbody>
              {refusal.questions.map((q) => (
                <tr key={q.q}>
                  <td>{q.q}</td>
                  <td className={`res ${q.refused ? "ok" : "bad"}`}>{q.refused ? "Refused by the cutoff" : "Left to the prompt rule"}</td>
                  <td className="num">{q.best.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Set>
      </section>

      <section>
        <h2>What this does not show</h2>
        <p>
          Both question sets are written by me, so neither is independent. The check does not judge whether an answer is good, only whether the right text was retrieved. Thirty questions is small. The index is rebuilt by a script, so it can drift from the site until that runs.
        </p>
      </section>

      <section>
        <h2>Inspect it</h2>
        <ul>
          <li><a href={`${REPO}/backend/scripts/retrieval_eval.py`} target="_blank" rel="noopener noreferrer">The check</a>, the <a href={`${REPO}/backend/scripts/retrieval_eval_holdout.json`} target="_blank" rel="noopener noreferrer">fresh question set</a> and the <a href={`${REPO}/scripts/build-rag-chunks.cjs`} target="_blank" rel="noopener noreferrer">indexer</a>.</li>
          <li>The story of how I found and fixed the problem: <Link to="/blog/#post-13">My portfolio assistant was retrieving code. I measured it, then fixed it.</Link></li>
          <li>The system it measures: <Link to="/case-studies/rag-portfolio-assistant/">RAG Portfolio Assistant</Link>. Ask the assistant on this page anything and open "How this answer was made" under its reply to see what it retrieved.</li>
        </ul>
      </section>
    </Wrap>
  </Layout>
);

export default Evidence;
