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
    mainEntityOfPage: `https://bhimeshchauhan.com${pathname}`,
    image: `https://bhimeshchauhan.com/og/case-${study.slug}.jpg`,
    author: {
      "@type": "Person",
      name: "Bhimesh Chauhan",
      url: "https://bhimeshchauhan.com/"
    },
    keywords: study.seo.keywords.join(", "),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://bhimeshchauhan.com/" },
        { "@type": "ListItem", position: 2, name: "Case Studies", item: "https://bhimeshchauhan.com/case-studies/" },
        { "@type": "ListItem", position: 3, name: study.title, item: `https://bhimeshchauhan.com${pathname}` }
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
        image: `/og/case-${study.slug}.jpg`,
        imageAlt: `${study.title}: ${study.keyResult}`,
        structuredData
      }}
    >
      <CaseStudyDetail study={study} />
    </Layout>
  );
};

export default CaseStudyTemplate;
