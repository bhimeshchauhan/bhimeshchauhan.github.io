// Generates the 1200x630 share cards (static/og/*.jpg) shown when a page link is pasted into LinkedIn, Slack or WhatsApp.
// Cards come from the same data the site renders (case studies, retrieval results), so they cannot go stale.
//   node scripts/build-og-cards.cjs          # needs Google Chrome and macOS `sips` (or ImageMagick `magick`)
// Set CHROME=/path/to/chrome to use a different browser binary.
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "..");
const outDir = path.join(root, "static", "og");
const chrome = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const font = (pkg, file) => `file://${path.join(root, "node_modules", "@fontsource", pkg, "files", file)}`;
const photo = `file://${path.join(root, "static", "me-cutout.webp")}`;

const caseStudies = require(path.join(root, "src/data/caseStudies.js"));
const results = JSON.parse(fs.readFileSync(path.join(root, "src/data/retrieval-results.json"), "utf8"));

const cards = [
  ...caseStudies.map((s) => ({
    file: `case-${s.slug}`,
    label: `Case study · ${s.label}`,
    title: s.title,
    result: s.keyResult
  })),
  { file: "hire", label: "Hire", title: "Hire me for AI platform work that has to ship.", result: "$700K in 48 hours · ~80% less documentation time · ~200 daily users" },
  {
    file: "evidence",
    label: "Evidence",
    title: "How well does the assistant retrieve the right answer?",
    result: `${results.holdout.hitk} of ${results.holdout.n} found on questions it was never tuned on`
  },
  { file: "resume", label: "Resume", title: "Bhimesh Chauhan", result: "Lead AI platform engineer · 10+ years of production software" },
  { file: "blog", label: "Blog", title: "Notes on engineering, AI and building products", result: "How I measure and fix production AI systems" }
];

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const titleSize = (t) => (t.length > 62 ? 46 : t.length > 42 ? 54 : 66);

const html = (c) => `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:SG;font-weight:700;src:url("${font("space-grotesk", "space-grotesk-latin-700-normal.woff2")}")}
@font-face{font-family:IN;font-weight:500;src:url("${font("inter", "inter-latin-500-normal.woff2")}")}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;overflow:hidden;background:#07080c;color:#f2f0ea;font-family:IN,sans-serif;position:relative}
.glow{position:absolute;right:-120px;bottom:-160px;width:760px;height:760px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,180,84,.20),rgba(59,75,216,.10) 62%,transparent 80%)}
.photo{position:absolute;right:30px;bottom:0;width:430px;height:430px;object-fit:contain;-webkit-mask-image:linear-gradient(to bottom,#000 80%,transparent 100%)}
.text{position:absolute;left:64px;top:56px;bottom:56px;width:690px;display:flex;flex-direction:column}
.bar{width:56px;height:4px;background:#ffb454;margin-bottom:22px}
.label{font-size:22px;letter-spacing:.14em;text-transform:uppercase;color:#a3a8b8}
h1{font-family:SG;font-weight:700;font-size:${titleSize(c.title)}px;line-height:1.06;letter-spacing:-.035em;margin-top:26px}
.result{font-family:SG;font-weight:700;font-size:36px;line-height:1.2;color:#ffb454;margin-top:30px;letter-spacing:-.01em}
.foot{margin-top:auto;font-size:24px;color:#a3a8b8}
.foot b{color:#f2f0ea;font-weight:500}
</style><div class="glow"></div><img class="photo" src="${photo}"><div class="text"><div class="bar"></div><div class="label">${esc(c.label)}</div><h1>${esc(c.title)}</h1><div class="result">${esc(c.result)}</div><div class="foot"><b>Bhimesh Chauhan</b> · Lead AI platform engineer</div></div>`;

fs.mkdirSync(outDir, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "og-"));
for (const c of cards) {
  const page = path.join(tmp, `${c.file}.html`);
  const png = path.join(tmp, `${c.file}.png`);
  const jpg = path.join(outDir, `${c.file}.jpg`);
  fs.writeFileSync(page, html(c));
  execFileSync(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", "--allow-file-access-from-files", "--virtual-time-budget=4000", "--window-size=1200,630", `--screenshot=${png}`, `file://${page}`], { stdio: "ignore" });
  try {
    execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "82", png, "--out", jpg], { stdio: "ignore" });
  } catch (e) {
    execFileSync("magick", [png, "-quality", "82", jpg], { stdio: "ignore" });
  }
  console.log(`${c.file}.jpg  ${(fs.statSync(jpg).size / 1024).toFixed(0)} KB`);
}
fs.rmSync(tmp, { recursive: true, force: true });
