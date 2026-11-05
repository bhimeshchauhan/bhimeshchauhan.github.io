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
  FlowDetail,
  FlowDiagram,
  MetaStrip,
  PhoneFrame,
  PhoneRow,
  SourceNote,
  StatGrid,
  TagList
} from "../../styles/caseStudiesStyle";

const List = ({ items }) => (
  <ul>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const Flow = ({ study }) => {
  const [active, setActive] = React.useState(0);
  const detail = study.flowDetail && study.flowDetail[active];
  return (
    <>
      <FlowDiagram aria-label={`${study.title} architecture flow`}>
        {study.flow.map((step, i) => (
          <li key={step}>
            <button
              type="button"
              className={i === active ? "on" : ""}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
            >
              {step}
            </button>
          </li>
        ))}
      </FlowDiagram>
      {detail && <FlowDetail aria-live="polite" key={active}>{detail}</FlowDetail>}
    </>
  );
};

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

    <MetaStrip aria-label="Case study facts">
      <div><dt>Role</dt><dd>{study.role}</dd></div>
      <div><dt>Team</dt><dd>{study.team}</dd></div>
      <div><dt>Status</dt><dd>{study.status}</dd></div>
      <div><dt>Stack</dt><dd>{study.technologies.slice(0, 4).join(", ")}</dd></div>
    </MetaStrip>

    <DetailSection>
      <h2>Outcome</h2>
      <p>{study.outcome}</p>
      {study.results.length > 0 && (
        <StatGrid>
          {study.results.map(({ value, label }) => (
            <li key={value}>
              <strong>{value}</strong>
              <span>{label}</span>
            </li>
          ))}
        </StatGrid>
      )}
      {study.resultsSource && <SourceNote>{study.resultsSource}</SourceNote>}
    </DetailSection>

    {study.demo && (
      <DetailSection>
        <h2>Product in action</h2>
        <p>{study.demo.caption}</p>
        <PhoneRow>
          <PhoneFrame className="main">
            <video src={study.demo.video} poster={study.demo.poster} autoPlay loop muted playsInline preload="metadata" aria-label={`${study.title} app demo recording`} />
          </PhoneFrame>
          {study.demo.stills.map((s) => (
            <figure key={s.src}>
              <PhoneFrame>
                <img src={s.src} alt={s.caption} loading="lazy" width="384" height="784" />
              </PhoneFrame>
              <figcaption>{s.caption}</figcaption>
            </figure>
          ))}
        </PhoneRow>
      </DetailSection>
    )}

    <DetailSection>
      <h2>What I owned</h2>
      {study.scope.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </DetailSection>

    <DetailSection>
      <h2>System at a glance</h2>
      {study.flow && <Flow study={study} />}
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
