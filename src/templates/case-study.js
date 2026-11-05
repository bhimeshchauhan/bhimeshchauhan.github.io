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
    "@type": "TechArticle",
    headline: study.title,
    description: study.seo.description,
    mainEntityOfPage: `https://bhimeshchauhan.github.io${pathname}`,
    author: {
      "@type": "Person",
      name: "Bhimesh Chauhan",
      url: "https://bhimeshchauhan.github.io/"
    },
    keywords: study.seo.keywords.join(", "),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://bhimeshchauhan.github.io/" },
        { "@type": "ListItem", position: 2, name: "Case Studies", item: "https://bhimeshchauhan.github.io/case-studies/" },
        { "@type": "ListItem", position: 3, name: study.title, item: `https://bhimeshchauhan.github.io${pathname}` }
      ]
    }
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
