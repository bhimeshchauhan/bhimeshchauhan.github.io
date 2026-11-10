// Builds the chunks the portfolio assistant retrieves from, as JSON on stdout:
//   [{ source, tag, content }]
// Sources are prose only (llms-full.txt, case studies, blog posts, projects, a few small data files),
// never raw source code. Every chunk starts with its own context ("Case study: Ask Kindred.") so it
// still makes sense when retrieved alone.   Run: node scripts/build-rag-chunks.cjs > chunks.json
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const MAX = 1100; // characters per chunk, before the context prefix

// Loads a src/data/*.js file (ES module or CommonJS) without a bundler: image imports become "".
const loadData = (name) => {
  let s = fs.readFileSync(path.join(root, "src/data", name), "utf8");
  s = s.replace(/^import\s+(\w+)\s+from\s+['"][^'"]+['"];?\s*$/gm, (_, id) => `const ${id} = "";`);
  s = s.replace(/export\s+default\s+/, "module.exports = ");
  const m = { exports: {} };
  vm.runInNewContext(s, { module: m, require, process });
  return m.exports;
};

const clean = (t) =>
  String(t)
    .replace(/\s*\(https?:\/\/[^)\s]+\)/g, "")
    .replace(/\s*https?:\/\/\S+/g, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/[●•]\s*/g, "- ")
    .replace(/\*\*/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\s+([;,.])/g, "$1")
    .trim();

const sentences = (t) => t.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [t];

// Packs parts (lines/paragraphs) into chunks of at most MAX characters, each prefixed with its context.
const pack = (prefix, parts) => {
  const out = [];
  let cur = "";
  const flush = () => {
    if (cur.trim()) out.push(`${prefix} ${cur.trim()}`);
    cur = "";
  };
  for (const raw of parts.map(clean).filter(Boolean)) {
    const pieces = raw.length > MAX ? sentences(raw) : [raw];
    for (const p of pieces) {
      if (cur && cur.length + p.length + 1 > MAX) flush();
      cur += (cur ? "\n" : "") + p;
    }
  }
  flush();
  return out;
};

const chunks = [];
const add = (source, tag, list) => list.forEach((content) => chunks.push({ source, tag, content }));

// 1. Profile: static/llms-full.txt (the same text the job-fit function reasons from).
{
  const txt = fs.readFileSync(path.join(root, "static/llms-full.txt"), "utf8");
  const [head, ...rest] = txt.split(/\n## /);
  add("profile", "overview", pack("Bhimesh Chauhan, overview.", head.replace(/^# .*\n/, "").replace(/^>\s*/gm, "").split("\n")));
  for (const sec of rest) {
    const [title, ...lines] = sec.split("\n");
    if (/^Machine-readable/i.test(title)) continue;
    if (/^Work history/i.test(title)) {
      for (const sub of lines.join("\n").split(/\n### /).filter((s) => s.trim())) {
        const [h, ...l] = sub.replace(/^### /, "").split("\n");
        add("profile", "work", pack(`Work history: ${clean(h)}.`, l));
      }
    } else if (/^Requirement-to-evidence/i.test(title)) {
      // One chunk per requirement: each bullet answers one kind of question on its own.
      for (const l of lines.filter((x) => x.startsWith("- "))) add("profile", "evidence", pack("Evidence for the requirement:", [l.slice(2)]));
    } else {
      add("profile", title.toLowerCase().split(/\W+/)[0], pack(`${clean(title)}.`, lines));
    }
  }
}

// 2. Case studies.
for (const s of loadData("caseStudies.js")) {
  const prefix = `Case study: ${s.title}.`;
  const parts = [];
  parts.push(`${s.label}. Role: ${s.role}. Team: ${s.team}. Status: ${s.status}. Key result: ${s.keyResult}.`);
  parts.push(s.summary, `Outcome: ${s.outcome}`);
  add("case_study", s.slug, pack(prefix, parts));
  add("case_study", s.slug, pack(`${prefix} Responsibilities and ownership.`, s.scope));
  const flow = s.flow ? [`Flow: ${s.flow.join(" -> ")}.`, ...(s.flowDetail || [])] : [];
  add("case_study", s.slug, pack(`${prefix} How the system works.`, [...flow, ...(s.architecture || [])]));
  add("case_study", s.slug, pack(`${prefix} Key decisions and reliability.`, [...(s.decisions || []), ...(s.reliability || [])]));
  if (s.evals) {
    add("case_study", s.slug, pack(`${prefix} How quality is measured.`, [s.evals.summary, ...s.evals.rows.map((r) => `${r.value}: ${r.label}.`), ...s.evals.points]));
  }
  if (s.operations) {
    add("case_study", s.slug, pack(`${prefix} Speed, uptime and cost.`, [s.operations.map((o) => `${o.label}: ${o.value}`).join("; ") + "."]));
  }
  const facts = [];
  if (s.results && s.results.length) facts.push(`Results: ${s.results.map((r) => `${r.value} ${r.label}`).join("; ")}.`);
  facts.push(`Technologies: ${s.technologies.join(", ")}.`);
  add("case_study", s.slug, pack(`${prefix} Results and technologies.`, facts));
}

// 3. Blog posts: one prefix per post, sections packed together.
for (const p of loadData("blog.js")) {
  const prefix = `Blog post "${p.title}" (${p.dated}).`;
  const secs = [];
  let cur = { h: "", lines: [] };
  const push = () => cur.lines.length && secs.push(cur);
  for (const [tag, v] of p.description) {
    if (tag === "h3") {
      push();
      cur = { h: v, lines: [] };
    } else if (tag === "p") cur.lines.push(v.map(([, t]) => t).join(""));
    else if (tag === "bars") cur.lines.push(`${v.title}: ${v.rows.map((r) => `${r.label} ${r.text || r.value + (v.unit || "")}`).join("; ")}.`);
    else if (tag === "pairs") cur.lines.push(`${v.title}: ${v.rows.map((r) => `${r.label} went from ${r.before} to ${r.after}`).join("; ")}.`);
    else if (tag === "steps") cur.lines.push(`Steps: ${v.map(([n, note]) => `${n} (${note})`).join(" -> ")}.`);
    else if (tag === "blockquote") cur.lines.push(v);
  }
  push();
  const parts = [p.tagLine, ...secs.flatMap((s) => (s.h ? [`${s.h}.`, ...s.lines] : s.lines))];
  add("blog", p.title, pack(prefix, parts));
}

// 4. Projects (one chunk each).
for (const p of loadData("ProProjects.js")) {
  const body = `${p.description} Technologies: ${p.techUsed}.`;
  add("projects", p.title, pack(`Project: ${p.title}${p.year ? ` (${p.year})` : ""}.`, [body]));
}

// 5. Small facts: interests, education, languages, recommendation.
{
  const interests = loadData("Interests.js").map((i) => i.name);
  add("extras", "interests", pack("Bhimesh's interests and hobbies.", [interests.join(", ") + "."]));
  const rec = loadData("Recommendation.js");
  for (const r of rec) add("extras", "recommendation", pack(`Recommendation for Bhimesh from ${r.name}, ${r.designation}.`, [r.description]));
}

const seen = new Set();
const unique = chunks.filter((c) => (seen.has(c.content) ? false : seen.add(c.content)));
process.stdout.write(JSON.stringify(unique, null, 1));
process.stderr.write(
  `chunks: ${unique.length}; by source: ${JSON.stringify(unique.reduce((a, c) => ((a[c.source] = (a[c.source] || 0) + 1), a), {}))}; ` +
    `length min/avg/max: ${Math.min(...unique.map((c) => c.content.length))}/${Math.round(unique.reduce((a, c) => a + c.content.length, 0) / unique.length)}/${Math.max(...unique.map((c) => c.content.length))}\n`
);
