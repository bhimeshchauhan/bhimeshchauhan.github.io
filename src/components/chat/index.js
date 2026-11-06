import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import DOMPurify from "dompurify";
import { ASK_KEY, ASK_URL, JOB_FIT_URL, useAssistantOnline } from "../../utils/assistant";
import { renderFit } from "../../utils/fitRender";
import { MAX_CHARS } from "../../utils/fitFiles";
import { CONNECT_INTENT, OWNER_EMAIL, whatsappLink } from "../../utils/connect";
import { Link } from "gatsby";
import ConnectCard from "./ConnectCard";
import FitCard from "./FitCard";
import Trace from "./Trace";

// Deep links shown under an answer. Most specific first; matched against question + answer.
const LINKS = [
  [/scrubs|clinical|ambient|documentation time/i, "Scrubs Co-Pilot case study", "/case-studies/scrubs-copilot/"],
  [/jefferson|700|launch|checkout|sales|revenue/i, "Jefferson Fisher case study", "/case-studies/jefferson-fisher/"],
  [/kindred|rare ?days|rag |chatbot|retrieval/i, "Ask Kindred case study", "/case-studies/ask-kindred/"],
  [/wrangle|expo|react native|travel guide|micro-guide/i, "Wrangle case study", "/case-studies/wrangle/"],
  [/audiobook|narrat|text-to-speech|tts/i, "PDF-to-Audiobook case study", "/case-studies/pdf-to-audiobook/"],
  [/portfolio assistant|this site|this portfolio/i, "RAG Portfolio Assistant", "/case-studies/rag-portfolio-assistant/"],
  [/jefferson|checkout|course platform|stripe|kindred platform|caregiver|project/i, "Projects", "/projects/"],
  [/benchsci|preply|datarobot|micromart|pitchly|nebullam|experience|worked at|career|role/i, "Experience", "/experience/"],
  [/skill|stack|python|typescript|react|node|aws|docker/i, "Skills", "/skills/"],
  [/goal|hobb|piano|bucket|travel/i, "Goals", "/goals/"],
  [/blog|writ|boxing|essay/i, "Blog", "/blog/"],
  [/recommend|testimonial|nebullam/i, "Recommendations", "/recommendation/"],
];
const linksFor = (text) => {
  const out = [];
  for (const [re, label, to] of LINKS) if (re.test(text) && !out.some((o) => o.to === to)) out.push({ label, to });
  return out.slice(0, 3);
};

const display = `"Space Grotesk", "Inter", sans-serif`;
const blink = keyframes`0%,80%,100%{opacity:.25}40%{opacity:1}`;

const ring = keyframes`0%{box-shadow:0 0 0 0 rgba(255,180,84,.55)}70%{box-shadow:0 0 0 12px rgba(255,180,84,0)}100%{box-shadow:0 0 0 0 rgba(255,180,84,0)}`;

const Avatar = styled.span`
  animation: ${ring} 2.6s infinite;
  border-radius: 50%;
  flex: none;
  height: 42px;
  overflow: hidden;
  position: relative;
  width: 42px;
  img { border-radius: 0; display: block; height: 100%; margin: 0; max-width: none; object-fit: cover; width: 100%; }
`;

const Launcher = styled.button`
  align-items: center;
  background: rgba(14, 16, 24, 0.88);
  backdrop-filter: blur(14px);
  border: 1px solid var(--line);
  border-radius: 999px;
  bottom: 20px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
  color: var(--ink);
  cursor: pointer;
  display: flex;
  font-family: "Inter", sans-serif;
  gap: 0.75rem;
  max-width: min(340px, calc(100vw - 32px));
  padding: 0.4rem 1.1rem 0.4rem 0.4rem;
  position: fixed;
  right: 20px;
  text-align: left;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.25s ease;
  z-index: 999;
  &:hover, &:focus-visible { border-color: var(--accent); transform: translateY(-2px); }
  .txt { display: flex; flex-direction: column; min-width: 0; }
  .lbl { align-items: center; color: var(--muted); display: flex; font-size: 0.68rem; gap: 0.4rem; letter-spacing: 0.12em; text-transform: uppercase; }
  .lbl::before { background: #3ddc84; border-radius: 50%; content: ""; height: 6px; width: 6px; }
  .prompt { height: 1.35em; overflow: hidden; position: relative; width: 14.5rem; }
  .prompt span { display: block; font-size: 0.92rem; font-weight: 600; line-height: 1.35; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  @media (max-width: 560px) { padding: 0.35rem; .txt { display: none; } }
`;

const Panel = styled(motion.section)`
  background: rgba(13, 15, 22, 0.94);
  backdrop-filter: blur(20px);
  border: 1px solid var(--line);
  border-radius: 24px;
  bottom: 20px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
  display: flex;
  flex-direction: column;
  height: min(620px, calc(100vh - 40px));
  overflow: hidden;
  position: fixed;
  right: 20px;
  width: min(390px, calc(100vw - 24px));
  z-index: 1000;
  font-family: "Inter", sans-serif;
  color: var(--ink);
  @media (max-width: 560px) { bottom: 0; height: 100vh; right: 0; width: 100vw; border-radius: 0; }
`;

const Head = styled.header`
  align-items: center;
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1rem 0.9rem 1.1rem;
  .who { flex: 1; min-width: 0; }
  .who small { align-items: center; color: var(--muted); display: flex; font-size: 0.68rem; gap: 0.45rem; letter-spacing: 0.12em; text-transform: uppercase; }
  .who small::before { background: #3ddc84; border-radius: 50%; content: ""; height: 6px; width: 6px; }
  .live { background: none; border: 0; color: var(--ink); cursor: pointer; display: block; font-family: ${display}; font-size: 1rem; font-weight: 700; height: 1.5em; letter-spacing: -0.01em; overflow: hidden; padding: 0; position: relative; text-align: left; width: 100%; border-radius: 0; line-height: 1.5; }
  .live span { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .live:hover { color: var(--accent); background: none; }
  button { background: transparent; border: 0; border-radius: 50%; color: var(--muted); cursor: pointer; font-size: 1.3rem; height: 34px; line-height: 1; width: 34px; }
  button:hover { background: rgba(255,255,255,0.08); color: var(--ink); }
`;

const Log = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  padding: 0.5rem 1.1rem 1rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.2) transparent;
  .msg { font-size: 0.97rem; line-height: 1.55; max-width: 88%; overflow-wrap: anywhere; }
  .msg.bot { color: var(--ink); }
  .msg.me { align-self: flex-end; background: var(--accent); border-radius: 18px 18px 4px 18px; color: #0b0d12; padding: 0.55rem 0.9rem; }
  .msg a { color: var(--accent); }
  .msg strong { font-weight: 600; }
  .msg p { margin: 0 0 0.5rem; }
  .thinking { align-items: center; color: var(--muted); display: flex; font-size: 0.9rem; gap: 0.6rem; }
  .thinking i { animation: ${blink} 1.2s infinite; background: var(--accent); border-radius: 50%; display: inline-block; height: 7px; width: 7px; }
  .refs { align-items: center; display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: -0.35rem; }
  .refs small { color: var(--muted); font-size: 0.72rem; letter-spacing: 0.1em; margin-right: 0.2rem; text-transform: uppercase; }
  .refs a { background: rgba(255,180,84,0.1); border: 1px solid rgba(255,180,84,0.35); border-radius: 999px; color: var(--ink); font-size: 0.82rem; padding: 0.3rem 0.75rem; text-decoration: none; transition: background .2s, color .2s; }
  .refs a:hover, .refs a:focus-visible { background: var(--accent); color: #0b0d12; }
  .sugg { display: flex; flex-direction: column; gap: 0.4rem; margin-top: 0.25rem; }
  .sugg button { background: transparent; border: 1px solid var(--line); border-radius: 14px; color: var(--muted); cursor: pointer; font: 0.88rem "Inter", sans-serif; padding: 0.55rem 0.85rem; text-align: left; transition: color .2s, border-color .2s, background .2s; }
  .sugg button:hover { background: rgba(255,255,255,0.05); border-color: var(--accent); color: var(--ink); }
`;

const Compose = styled.form`
  align-items: center;
  border-top: 1px solid var(--line);
  display: flex;
  gap: 0.5rem;
  padding: 0.7rem 0.8rem;
  input { background: transparent; border: 0; color: var(--ink); flex: 1; font: 1rem "Inter", sans-serif; min-width: 0; outline: none; padding: 0.5rem 0.4rem; }
  input::placeholder { color: var(--muted); }
  button { background: var(--accent); border: 0; border-radius: 50%; color: #0b0d12; cursor: pointer; font-size: 1.1rem; font-weight: 700; height: 38px; width: 38px; }
  button:disabled { opacity: 0.4; cursor: default; }
`;

const Foot = styled.div`
  border-top: 1px solid var(--line);
  color: var(--muted);
  display: flex;
  font-size: 0.8rem;
  gap: 0.9rem;
  justify-content: center;
  padding: 0.5rem 0.8rem 0.65rem;
  a { color: var(--muted); text-decoration: none; }
  a:hover { color: var(--accent); }
`;

const PROMPTS = [
  "How did Scrubs cut 80%?",
  "What's his RAG experience?",
  "Has he led teams?",
  "His work at Rare Days?",
  "Explain the Wrangle stack",
  "What's his tech stack?",
  "Can I message him?",
];
// Asking to be matched against a role opens the job-description card instead of calling the model.
const FIT_INTENT = /(job description|how (do|does|would) (you|he|bhimesh) fit|am i a fit|is he a (good )?fit|fit for (the|this|a|our) (role|job|position)|match (him|you|bhimesh)? ?(to|with|against) (a|the|this|my)? ?(role|job|position|posting)|compare.*(role|job|posting))/i;
const THINKING = ["Searching the resume", "Reading case studies", "Checking project notes", "Writing an answer"];

const useRotate = (list, ms) => {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return undefined;
    const t = setInterval(() => setI((n) => (n + 1) % list.length), ms);
    return () => clearInterval(t);
  }, [list, ms, reduce]);
  return [i, list[i]];
};

const SUGGESTIONS = [
  "What has Bhimesh built?",
  "What's his experience with RAG?",
  "I'd like to talk to Bhimesh",
];

// Sanitized, minimal markdown (**bold**, line breaks). Model output is untrusted.
const toHtml = (text) =>
  DOMPurify.sanitize(
    String(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n{2,}/g, "<br/><br/>").replace(/\n/g, "<br/>"),
    { ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "br", "p"], ALLOWED_ATTR: ["href", "target", "rel"], ALLOW_DATA_ATTR: false }
  );

const clean = (input) =>
  DOMPurify.sanitize(String(input || ""), { ALLOWED_TAGS: [], ALLOWED_ATTR: [], KEEP_CONTENT: true }).trim().slice(0, 1000);

const ChatComponent = () => {
  const online = useAssistantOnline();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState([
    { role: "bot", html: "Hi, I'm Bhimesh's assistant. Ask me about his work and experience, or I can pass him a message." },
  ]);
  const logRef = useRef(null);
  const fitCtx = useRef(null); // the job description + analysis, so follow-up questions have context
  const inputRef = useRef(null);
  const [pi, prompt] = useRotate(PROMPTS, 3200);
  const [ti, thinking] = useRotate(THINKING, 1400);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [msgs, busy, open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const push = (m) => setMsgs((prev) => [...prev, m]);

  const send = async (raw) => {
    const q = clean(raw);
    if (!q || busy) return;
    setText("");
    push({ role: "me", html: DOMPurify.sanitize(q, { ALLOWED_TAGS: [] }) });
    if (FIT_INTENT.test(q)) {
      push({ role: "bot", html: "Happy to. Paste the job description or upload a file below and I will show how Bhimesh fits." });
      push({ role: "fit" });
      return;
    }
    if (CONNECT_INTENT.test(q)) {
      push({ role: "bot", html: "Happy to connect you with Bhimesh." });
      push({ role: "card" });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(ASK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${ASK_KEY}` },
        body: JSON.stringify({
          query: q,
          ...(fitCtx.current ? { history: [{ user: `I shared this job description: ${fitCtx.current.jd}`, assistant: fitCtx.current.analysis }] } : {}),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.response) {
        push({ role: "bot", html: toHtml(data.response) });
        if (data.trace && Array.isArray(data.trace.chunks)) push({ role: "trace", trace: data.trace });
        const links = linksFor(`${q} ${data.response}`);
        if (links.length) push({ role: "links", links });
      }
      else push({ role: "bot", html: `I'm having trouble right now. You can reach Bhimesh directly at ${OWNER_EMAIL}.` });
    } catch (e) {
      push({ role: "bot", html: `I couldn't connect just now. You can reach Bhimesh directly at ${OWNER_EMAIL}.` });
    } finally {
      setBusy(false);
    }
  };

  // Runs a job-fit analysis as part of the conversation, so the visitor can keep asking about the role.
  const runFit = async (raw) => {
    const t = String(raw || "").trim().slice(0, MAX_CHARS);
    if (!t) return;
    setOpen(true);
    setMsgs((prev) => prev.filter((m) => m.role !== "fit"));
    if (busy) return push({ role: "bot", html: "I am finishing another answer. Please send the job description again in a moment." });
    const snippet = t.replace(/\s+/g, " ").slice(0, 110);
    push({ role: "me", html: DOMPurify.sanitize(`Show how Bhimesh fits this role: “${snippet}…”`, { ALLOWED_TAGS: [] }) });
    setBusy(true);
    try {
      const res = await fetch(JOB_FIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${ASK_KEY}` },
        body: JSON.stringify({ text: t }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && typeof data.analysis === "string") {
        fitCtx.current = { jd: t.slice(0, 2500), analysis: data.analysis.slice(0, 2500) };
        push({ role: "bot", fit: true, html: renderFit(data.analysis) });
        push({ role: "bot", html: 'Ask me anything about this role, such as how Bhimesh would handle a gap, or <a href="/contact/">contact him about it</a>.' });
        // Show the top of the analysis, not the bottom of the chat.
        setTimeout(() => {
          const l = logRef.current;
          const els = l && l.querySelectorAll(".msg.fit");
          if (els && els.length) l.scrollTop += els[els.length - 1].getBoundingClientRect().top - l.getBoundingClientRect().top - 8;
        }, 150);
      } else {
        const why = typeof data.error === "string" && data.error.length < 300 ? data.error : `I could not complete the analysis right now. You can reach Bhimesh directly at ${OWNER_EMAIL}.`;
        push({ role: "bot", html: DOMPurify.sanitize(why, { ALLOWED_TAGS: [] }) });
      }
    } catch (e) {
      push({ role: "bot", html: `I could not connect just now. You can reach Bhimesh directly at ${OWNER_EMAIL}.` });
    } finally {
      setBusy(false);
    }
  };

  // Lets other parts of the site open the assistant with a question.
  useEffect(() => {
    const onAsk = (e) => {
      setOpen(true);
      if (e.detail) send(e.detail);
    };
    const onFit = (e) => {
      if (e.detail && e.detail.text) return runFit(e.detail.text);
      setOpen(true);
      setMsgs((prev) => (prev.some((m) => m.role === "fit") ? prev : [...prev, { role: "fit" }]));
    };
    window.addEventListener("ask-assistant", onAsk);
    window.addEventListener("assistant-fit", onFit);
    return () => {
      window.removeEventListener("ask-assistant", onAsk);
      window.removeEventListener("assistant-fit", onFit);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy]);

  if (!online) return null; // hidden while the assistant backend is offline (also during SSR)

  void ti;
  const asked = msgs.some((m) => m.role === "me");

  return (
    <>
      {!open && (
        <Launcher
          type="button"
          className="assistant-launcher"
          onClick={() => { setText(prompt); setOpen(true); }}
          aria-label="Open chat with Bhimesh's assistant"
        >
          <Avatar><img src="/me.jpg" alt="" width="42" height="42" /></Avatar>
          <span className="txt">
            <span className="lbl">Ask me anything</span>
            <span className="prompt" aria-hidden="true">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={pi} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-100%", opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                  {prompt}
                </motion.span>
              </AnimatePresence>
            </span>
          </span>
        </Launcher>
      )}
      <AnimatePresence>
        {open && (
          <Panel
            role="dialog"
            aria-label="Chat with Bhimesh's assistant"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Head>
              <Avatar><img src="/me.jpg" alt="" width="42" height="42" /></Avatar>
              <div className="who">
                <small>Live · try asking</small>
                <button type="button" className="live" onClick={() => { setText(prompt); inputRef.current && inputRef.current.focus(); }} aria-label={`Use suggested question: ${prompt}`}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={pi} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-100%", opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                      {prompt}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
            </Head>
            <Log ref={logRef} aria-live="polite">
              {msgs.map((m, i) =>
                m.role === "card" ? (
                  <ConnectCard key={i} />
                ) : m.role === "fit" ? (
                  <FitCard key={i} onSubmit={runFit} busy={busy} />
                ) : m.role === "trace" ? (
                  <Trace key={i} trace={m.trace} />
                ) : m.role === "links" ? (
                  <div key={i} className="refs" aria-label="Related pages">
                    <small>Read more</small>
                    {m.links.map((l) => (
                      <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>{l.label} <span aria-hidden="true">→</span></Link>
                    ))}
                  </div>
                ) : (
                  <div key={i} className={`msg ${m.role}${m.fit ? " fit" : ""}`} dangerouslySetInnerHTML={{ __html: m.html }} />
                )
              )}
              {busy && <div className="msg bot thinking" role="status"><i />{thinking}…</div>}
              {!asked && !busy && (
                <div className="sugg">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} type="button" onClick={() => send(s)}>{s}</button>
                  ))}
                  <button type="button" onClick={() => push({ role: "fit" })}>Match Bhimesh to a job description</button>
                </div>
              )}
            </Log>
            <Compose onSubmit={(e) => { e.preventDefault(); send(text); }}>
              <input ref={inputRef} aria-label="Your message" placeholder="Ask a question..." value={text} onChange={(e) => setText(e.target.value)} maxLength={300} />
              <button type="submit" disabled={busy || !text.trim()} aria-label="Send">↑</button>
            </Compose>
            <Foot>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a href={`mailto:${OWNER_EMAIL}`}>Email</a>
              <button type="button" style={{ background: "none", border: 0, color: "inherit", cursor: "pointer", font: "inherit", padding: 0 }} onClick={() => push({ role: "card" })}>Leave a message</button>
            </Foot>
          </Panel>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatComponent;
