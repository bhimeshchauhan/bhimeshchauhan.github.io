import React from "react";
import Layout from "../../components/layout";
import CaseStudyCard from "../../components/CaseStudies/CaseStudyCard";
import caseStudies from "../../data/caseStudies";
import {
  CaseStudiesIntro,
  CaseStudiesWrapper,
  CaseStudyGrid
} from "../../styles/caseStudiesStyle";

const CaseStudiesPage = () => {
  const description =
    "Selected product and platform work across applied AI, healthcare workflows, mobile systems, and grounded user experiences.";

  return (
    <Layout
      seo={{
        title: "Case Studies",
        description,
        type: "website",
        structuredData: {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Case Studies by Bhimesh Chauhan",
          description,
          url: "https://bhimeshchauhan.github.io/case-studies/"
        }
      }}
    >
      <CaseStudiesWrapper>
        <CaseStudiesIntro>
          <h1>Case Studies</h1>
          <p>
            I build products where practical engineering choices matter: the AI
            needs to be useful, the platform needs to be dependable, and the
            experience needs to make sense to the person using it.
          </p>
        </CaseStudiesIntro>
        <CaseStudyGrid>
          {caseStudies.map((study) => (
            <CaseStudyCard key={study.slug} study={study} />
          ))}
        </CaseStudyGrid>
      </CaseStudiesWrapper>
    </Layout>
  );
};

export default CaseStudiesPage;
