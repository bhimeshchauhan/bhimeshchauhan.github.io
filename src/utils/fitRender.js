import DOMPurify from "dompurify";

// Tiny markdown (bold, bullets, links back to this site) -> sanitized HTML.
// The server already strips everything else; this is a second layer because model output is untrusted.
export const renderFit = (md) => {
  const esc = String(md).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const inline = (t) =>
    t
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\((https:\/\/bhimeshchauhan\.github\.io\/[^)\s]*)\)/g, '<a href="$2">$1</a>')
      // a bare site URL the model left unwrapped becomes a short "source" link (trailing punctuation stays outside)
      .replace(/(?<![(">])(https:\/\/bhimeshchauhan\.github\.io\/[^\s)<]*?)([.,;:]?)(?=\s|$|\)|<)/g, '<a href="$1">source</a>$2');
  const out = [];
  let list = false;
  for (const line of esc.split("\n")) {
    const m = line.match(/^\s*(?:[-*•])\s+(.*)$/);
    if (m) { if (!list) { out.push("<ul>"); list = true; } out.push(`<li>${inline(m[1])}</li>`); continue; }
    if (list) { out.push("</ul>"); list = false; }
    if (line.trim()) out.push(`<p>${inline(line)}</p>`);
  }
  if (list) out.push("</ul>");
  return DOMPurify.sanitize(out.join(""), { ALLOWED_TAGS: ["p", "ul", "li", "strong", "a"], ALLOWED_ATTR: ["href"], ALLOW_DATA_ATTR: false });
};
