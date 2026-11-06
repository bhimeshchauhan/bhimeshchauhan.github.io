import React, { useRef, useState } from "react";
import styled from "styled-components";
import { ACCEPT, FileProblem, MAX_CHARS, MIN_CHARS, extractText } from "../../utils/fitFiles";

const COOLDOWN = 15 * 1000;
const LAST = "job-fit-last";

const Box = styled.div`
  color: var(--ink, #f2f0ea);
  font-family: "Signika", sans-serif;
  textarea { background: rgba(0,0,0,0.3); border: 1px solid var(--line, rgba(255,255,255,0.16)); border-radius: 12px; box-sizing: border-box; color: var(--ink, #f2f0ea); font: 1rem "Signika", sans-serif; min-height: 120px; padding: 0.65rem 0.75rem; resize: vertical; width: 100%; }
  textarea:focus { border-color: var(--accent, #ffb454); outline: none; }
  .row { align-items: center; display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.6rem; }
  .btn { align-items: center; background: transparent; border: 1px solid var(--line, rgba(255,255,255,0.22)); border-radius: 999px; color: var(--ink, #f2f0ea); cursor: pointer; display: inline-flex; font: 600 0.9rem "Signika", sans-serif; min-height: 44px; padding: 0.45rem 1rem; }
  .btn:hover, .btn:focus-visible { border-color: var(--accent, #ffb454); }
  .btn.primary { background: var(--accent, #ffb454); border-color: var(--accent, #ffb454); color: #0b0d12; }
  .btn[disabled] { cursor: default; opacity: 0.5; }
  .count { color: var(--muted, #a3a8b8); font-size: 0.75rem; margin-left: auto; }
  .note { color: var(--muted, #a3a8b8); font-size: 0.82rem; margin: 0.5rem 0 0; }
  .err { color: #ff9a8a; font-size: 0.88rem; margin: 0.5rem 0 0; }
  .priv { color: var(--muted, #a3a8b8); font-size: 0.78rem; line-height: 1.45; margin: 0.65rem 0 0; }
  input[type=file] { display: none; }
`;

// Paste or upload a job description. Files are read in the browser; only the text shown is ever submitted.
// onSubmit(text) is called with the text the visitor can see, so nothing hidden is sent.
const FitInput = ({ onSubmit, busy = false, cta = "Show the fit" }) => {
  const [text, setText] = useState("");
  const [reading, setReading] = useState(false);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const fileRef = useRef(null);

  const onFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = ""; // allow picking the same file again
    if (!file) return;
    setErr(""); setNote(""); setReading(true);
    try {
      const { text: t, truncated } = await extractText(file);
      setText(t);
      setNote(`Read ${t.length.toLocaleString()} characters from ${file.name.slice(0, 60)}${truncated ? " (the first part; the rest was cut)" : ""}. Review it below, then continue.`);
    } catch (x) {
      setErr(x instanceof FileProblem ? x.message : "I could not read that file. Please paste the text instead.");
    } finally {
      setReading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    const body = text.trim();
    if (body.length < MIN_CHARS) return setErr(`Please include more of the job description (at least ${MIN_CHARS} characters).`);
    try {
      if (Date.now() - Number(sessionStorage.getItem(LAST) || 0) < COOLDOWN) return setErr("One moment, please wait a few seconds before analyzing again.");
      sessionStorage.setItem(LAST, String(Date.now()));
    } catch (x) {}
    await onSubmit(body.slice(0, MAX_CHARS));
    setText(""); setNote("");
  };

  const off = busy || reading;
  return (
    <Box>
      <form onSubmit={submit}>
        <textarea
          aria-label="Job description"
          placeholder="Paste the role's responsibilities and requirements…"
          value={text}
          maxLength={MAX_CHARS}
          onChange={(e) => { setText(e.target.value); setNote(""); }}
          disabled={off}
        />
        <div className="row">
          <button type="button" className="btn" onClick={() => fileRef.current && fileRef.current.click()} disabled={off}>
            {reading ? "Reading…" : "Upload a file"}
          </button>
          <input ref={fileRef} type="file" accept={ACCEPT} onChange={onFile} aria-label="Upload a job description file (PDF, Word, text or markdown)" />
          <button type="submit" className="btn primary" disabled={off || !text.trim()}>{busy ? "Analyzing…" : cta}</button>
          <span className="count" aria-hidden="true">{text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}</span>
        </div>
      </form>
      {note && <p className="note" role="status">{note}</p>}
      {err && <p className="err" role="alert">{err}</p>}
      <p className="priv">PDF, Word (.docx), .txt or .md. Files are read in your browser and never uploaded. Only the text shown above is sent for analysis, and it is not stored. Please avoid confidential details.</p>
    </Box>
  );
};

export default FitInput;
