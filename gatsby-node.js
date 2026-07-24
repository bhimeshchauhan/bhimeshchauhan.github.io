const path = require("path");
const caseStudies = require("./src/data/caseStudies");

exports.createPages = ({ actions }) => {
  caseStudies.forEach(({ slug }) => {
    actions.createPage({
      path: `/case-studies/${slug}/`,
      component: path.resolve("./src/templates/case-study.js"),
      context: { slug }
    });
  });
};
