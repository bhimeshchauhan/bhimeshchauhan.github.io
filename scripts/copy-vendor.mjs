// Copies the in-browser document readers from node_modules into static/vendor at install time.
// They are loaded only when a visitor picks a file in the job-fit box, so normal page loads never download them.
// static/vendor is git-ignored; `npm install` / `npm ci` (CI included) regenerates it.
import { copyFileSync, mkdirSync, existsSync } from "node:fs";
const out = new URL("../static/vendor/", import.meta.url);
mkdirSync(out, { recursive: true });
const files = [
  ["../node_modules/pdfjs-dist/legacy/build/pdf.min.mjs", "pdf.min.mjs"],
  ["../node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs", "pdf.worker.min.mjs"],
  ["../node_modules/mammoth/mammoth.browser.min.js", "mammoth.browser.min.js"],
];
for (const [src, name] of files) {
  const from = new URL(src, import.meta.url);
  if (!existsSync(from)) { console.warn("copy-vendor: missing", src, "(run npm install)"); continue; }
  copyFileSync(from, new URL(name, out));
}
console.log("copy-vendor: ok");
