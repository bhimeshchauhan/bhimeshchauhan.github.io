// Reads a job description file entirely inside the visitor's browser and returns plain text.
// The file itself is never uploaded: only the extracted text is ever sent anywhere.
export const MAX_FILE = 5 * 1024 * 1024; // 5 MB
export const MAX_CHARS = 12000;
export const MIN_CHARS = 200;
export const ACCEPT = ".pdf,.docx,.txt,.md";
const ALLOWED = ["pdf", "docx", "txt", "md"];
const MAX_PDF_PAGES = 15;

export class FileProblem extends Error {}

const withTimeout = (p, ms, msg) =>
  Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new FileProblem(msg)), ms))]);

const startsWith = (bytes, sig) => sig.every((b, i) => bytes[i] === b);

// Pure and exported for tests: collapse whitespace and cap the length.
export const tidy = (s) =>
  String(s || "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, MAX_CHARS);

// Checks name, size and the file's real signature (not just its extension) before reading anything.
export const checkFile = (file, head) => {
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  if (!ALLOWED.includes(ext)) throw new FileProblem("That file type is not supported. Please use PDF, Word (.docx), .txt or .md, or paste the text.");
  if (!file.size) throw new FileProblem("That file is empty.");
  if (file.size > MAX_FILE) throw new FileProblem("That file is over 5 MB. Please paste just the role description instead.");
  if (ext === "pdf" && !startsWith(head, [0x25, 0x50, 0x44, 0x46, 0x2d])) throw new FileProblem("That does not look like a real PDF.");
  if (ext === "docx" && !startsWith(head, [0x50, 0x4b, 0x03, 0x04])) throw new FileProblem("That does not look like a real Word (.docx) file.");
  if ((ext === "txt" || ext === "md") && head.includes(0)) throw new FileProblem("That does not look like a plain text file.");
  return ext;
};

const loadScript = (src, global) =>
  new Promise((resolve, reject) => {
    if (window[global]) return resolve(window[global]);
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => (window[global] ? resolve(window[global]) : reject(new Error("reader missing")));
    s.onerror = () => reject(new Error("reader failed to load"));
    document.head.appendChild(s);
  });

// pdf.js returns text in small fragments. Joining them all with spaces turns letter-spaced headings into "R A R E D A Y S",
// so add a space only where there is a real horizontal gap, and a newline where the line changes.
export const joinItems = (items) => {
  let out = "";
  let prev = null;
  for (const it of items) {
    const t = it.transform || [];
    const x = t[4] || 0, y = t[5] || 0, h = it.height || 10;
    if (prev) {
      if (Math.abs(y - prev.y) > Math.max(2, prev.h * 0.5)) out += "\n";
      else if (x - prev.end > prev.h * 0.3) out += " ";
    }
    out += it.str || "";
    prev = { y, end: x + (it.width || 0), h };
    if (it.hasEOL) { out += "\n"; prev = null; }
  }
  // Letter-spaced capitals ("E N G I N E E R I N G") that still slipped through: collapse runs of 4+ single capitals.
  return out.replace(/\b(?:[A-Z] ){3,}[A-Z]\b/g, (m) => m.replace(/ /g, ""));
};

const readPdf = async (buf) => {
  const pdfjs = await import(/* webpackIgnore: true */ "/vendor/pdf.min.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = "/vendor/pdf.worker.min.mjs";
  // Text extraction only. Script evaluation, XFA forms, and eager fetching are all switched off.
  const task = pdfjs.getDocument({ data: new Uint8Array(buf), isEvalSupported: false, enableXfa: false, disableAutoFetch: true, disableStream: true });
  try {
    const doc = await withTimeout(task.promise, 20000, "That PDF took too long to read. Please paste the text instead.");
    let out = "";
    for (let i = 1; i <= Math.min(doc.numPages, MAX_PDF_PAGES) && out.length < MAX_CHARS; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      out += joinItems(content.items) + "\n\n";
    }
    return out;
  } catch (e) {
    if (e instanceof FileProblem) throw e;
    if (e && e.name === "PasswordException") throw new FileProblem("That PDF is password protected. Please paste the text instead.");
    throw new FileProblem("I could not read that PDF. Please paste the text instead.");
  } finally {
    task.destroy();
  }
};

const readDocx = async (buf) => {
  const mammoth = await loadScript("/vendor/mammoth.browser.min.js", "mammoth");
  try {
    const r = await withTimeout(mammoth.extractRawText({ arrayBuffer: buf }), 15000, "That document took too long to read. Please paste the text instead.");
    return r.value;
  } catch (e) {
    if (e instanceof FileProblem) throw e;
    throw new FileProblem("I could not read that Word file. Please paste the text instead.");
  }
};

// Returns { text, truncated }.
export const extractText = async (file) => {
  const head = new Uint8Array(await file.slice(0, 4096).arrayBuffer());
  const ext = checkFile(file, head);
  const buf = await file.arrayBuffer();
  let raw;
  if (ext === "pdf") raw = await readPdf(buf);
  else if (ext === "docx") raw = await readDocx(buf);
  else raw = new TextDecoder("utf-8").decode(buf);
  const full = String(raw || "");
  const text = tidy(full);
  if (text.length < MIN_CHARS) {
    throw new FileProblem(ext === "pdf" ? "I found almost no text. If that PDF is a scan, please paste the text instead." : "That file has too little text to analyze.");
  }
  return { text, truncated: full.replace(/\s+/g, " ").trim().length > MAX_CHARS };
};
