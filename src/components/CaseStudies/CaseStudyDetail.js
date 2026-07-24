import React from "react";
import { Link } from "gatsby";
import {
  ArchitectureList,
  Breadcrumb,
  DetailColumns,
  DetailFooter,
  DetailSection,
  DetailShell,
  DetailSummary,
  Eyebrow,
  TagList
} from "../../styles/caseStudiesStyle";

const List = ({ items }) => (
  <ul>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const CaseStudyDetail = ({ study }) => (
  <DetailShell>
    <Breadcrumb as={Link} to="/case-studies/">
      ← All case studies
    </Breadcrumb>
    <header>
      <Eyebrow>{study.label}</Eyebrow>
      <h1>{study.title}</h1>
      <DetailSummary>{study.summary}</DetailSummary>
    </header>

    <DetailSection>
      <h2>What I built</h2>
      {study.scope.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </DetailSection>

    <DetailSection>
      <h2>System at a glance</h2>
      <ArchitectureList>
        {study.architecture.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ArchitectureList>
    </DetailSection>

    <DetailColumns>
      <DetailSection>
        <h2>Key decisions</h2>
        <List items={study.decisions} />
      </DetailSection>
      <DetailSection>
        <h2>How I approached reliability</h2>
        <List items={study.reliability} />
      </DetailSection>
    </DetailColumns>

    <DetailSection>
      <h2>Outcome</h2>
      <p>{study.outcome}</p>
    </DetailSection>

    <DetailSection>
      <h2>Technology focus</h2>
      <TagList aria-label={`${study.title} technology focus`}>
        {study.technologies.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </TagList>
    </DetailSection>

    <DetailFooter>
      <Breadcrumb as={Link} to="/case-studies/">
        Explore all case studies →
      </Breadcrumb>
    </DetailFooter>
  </DetailShell>
);

export default CaseStudyDetail;
