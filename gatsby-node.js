const fs = require("fs");
const path = require("path");
const vm = require("vm");
const caseStudies = require("./src/data/caseStudies");

const SITE = "https://bhimeshchauhan.github.io";
const PAGES = ["/", "/experience/", "/case-studies/", "/projects/", "/skills/", "/blog/", "/recommendation/", "/art/", "/contact/"];

exports.createPages = ({ actions }) => {
  caseStudies.forEach(({ slug }) => {
    actions.createPage({
      path: `/case-studies/${slug}/`,
      component: path.resolve("./src/templates/case-study.js"),
      context: { slug }
    });
  });
};

// Sitemap generated from the page list + caseStudies so new studies are never missed.
exports.onPostBuild = () => {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [...PAGES, ...caseStudies.map(({ slug }) => `/case-studies/${slug}/`)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod></url>`)
    .join("\n")}\n</urlset>\n`;
  fs.writeFileSync(path.join(__dirname, "public", "sitemap.xml"), xml);

  // RSS feed from src/data/blog.js (ESM, so evaluate it as a module-less script).
  const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const src = fs.readFileSync(path.join(__dirname, "src/data/blog.js"), "utf8").replace("export default", "module.exports =");
  const sandbox = { module: { exports: [] } };
  vm.runInNewContext(src, sandbox);
  const posts = sandbox.module.exports
    .map((p) => ({ ...p, date: new Date(p.dated.split(" - ")[0].replace(/(\d+)(st|nd|rd|th)/, "$1")) }))
    .filter((p) => !isNaN(p.date))
    .sort((a, b) => b.date - a.date);
  const items = posts
    .map((p) => `    <item>\n      <title>${esc(p.title)}</title>\n      <link>${SITE}/blog/#post-${p.id}</link>\n      <guid isPermaLink="true">${SITE}/blog/#post-${p.id}</guid>\n      <pubDate>${p.date.toUTCString()}</pubDate>\n      <description>${esc(p.tagLine)}</description>\n    </item>`)
    .join("\n");
  const feed = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>Bhimesh Chauhan: Blog</title>\n    <link>${SITE}/blog/</link>\n    <description>Notes on engineering, AI and building products.</description>\n${items}\n  </channel>\n</rss>\n`;
  fs.writeFileSync(path.join(__dirname, "public", "feed.xml"), feed);
};
