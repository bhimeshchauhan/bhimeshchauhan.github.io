import React from "react";
import Layout from "../components/layout";
import CaseStudyDetail from "../components/CaseStudies/CaseStudyDetail";
import caseStudies from "../data/caseStudies";

const CaseStudyTemplate = ({ pageContext }) => {
  const study = caseStudies.find(({ slug }) => slug === pageContext.slug);

  if (!study) {
    return null;
  }

  const pathname = `/case-studies/${study.slug}/`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.seo.description,
    mainEntityOfPage: `https://bhimeshchauhan.github.io${pathname}`,
    author: {
      "@type": "Person",
      name: "Bhimesh Chauhan",
      url: "https://bhimeshchauhan.github.io/"
    },
    keywords: study.seo.keywords.join(", ")
  };

  return (
    <Layout
      seo={{
        title: study.title,
        description: study.seo.description,
        pathname,
        type: "article",
        structuredData
      }}
    >
      <CaseStudyDetail study={study} />
    </Layout>
  );
};

export default CaseStudyTemplate;
