import React from "react";
import { Link } from "gatsby";
import {
  CaseStudyCardShell,
  CaseStudyLink,
  Eyebrow,
  TagList
} from "../../styles/caseStudiesStyle";

const CaseStudyCard = ({ study }) => (
  <CaseStudyCardShell>
    <Eyebrow>{study.label}</Eyebrow>
    <h2>{study.title}</h2>
    <p>{study.summary}</p>
    <TagList aria-label={`${study.title} technologies`}>
      {study.technologies.slice(0, 4).map((technology) => (
        <li key={technology}>{technology}</li>
      ))}
    </TagList>
    <CaseStudyLink as={Link} to={`/case-studies/${study.slug}/`}>
      Read case study <span aria-hidden="true">→</span>
    </CaseStudyLink>
  </CaseStudyCardShell>
);

export default CaseStudyCard;
