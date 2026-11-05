const fs = require("fs");
const path = require("path");
const caseStudies = require("./src/data/caseStudies");

const SITE = "https://bhimeshchauhan.github.io";
const PAGES = ["/", "/experience/", "/case-studies/", "/projects/", "/skills/", "/blog/", "/recommendation/", "/contact/"];

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
};
