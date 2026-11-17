import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { programs, CHECKED } from "./programs.mjs";
import { match } from "./match.mjs";
import { resourceGroups, resourceCount } from "./resources";
import { Wrap, Eyebrow, H1, H2, H3, Lede, Card, Grid, Section, Reveal, ButtonLink, GhostButton, Rule, display, sans, glass } from "../ui";

const A = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
);

const Jump = styled.nav`
  background: rgba(7, 11, 31, 0.72);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(232, 194, 107, 0.16);
  position: sticky;
  top: 60px;
  z-index: 15;
  .hub-row { display: flex; gap: 0.4rem; overflow-x: auto; padding: 0.55rem 0; scrollbar-width: none; &::-webkit-scrollbar { display: none; } }
  a { border: 1px solid rgba(232, 194, 107, 0.3); border-radius: 999px; color: var(--gold2); flex: none; font-size: 0.84rem; font-weight: 600; padding: 0.4rem 0.9rem; text-decoration: none; white-space: nowrap; }
  a:hover { background: rgba(232, 194, 107, 0.14); }
`;

const HeroBox = styled.section`
  align-items: center;
  display: grid;
  gap: clamp(1.4rem, 4vw, 3rem);
  grid-template-columns: 1.25fr 0.75fr;
  padding: clamp(2.4rem, 7vw, 5rem) 0 clamp(1.5rem, 4vw, 2.5rem);
  @media (max-width: 820px) { grid-template-columns: 1fr; }
  .note { ${glass} padding: 1.5rem; text-align: center; }
  .note > span { color: var(--gold); display: block; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.2em; }
  .note .mark { color: var(--rose); font-family: ${display}; font-size: 3.6rem; line-height: 1.2; }
  .note p { color: var(--cream); font-family: ${display}; font-size: 1.7rem; line-height: 1.15; margin: 0 0 0.9rem; }
  .note small { color: var(--muted); display: block; line-height: 1.55; }
`;

const Form = styled.form`
  ${glass}
  display: grid;
  gap: 0.9rem;
  grid-template-columns: repeat(4, minmax(0, 1fr)) auto;
  align-items: end;
  padding: 1.1rem;
  @media (max-width: 960px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 520px) { grid-template-columns: 1fr; }
  label { color: var(--muted); display: grid; font-size: 0.82rem; font-weight: 600; gap: 0.4rem; }
  select {
    background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(232, 194, 107, 0.35); border-radius: 10px; color: var(--cream); font: inherit; font-size: 0.95rem; min-height: 44px; padding: 0 0.7rem; width: 100%;
    option { background: #0c1240; color: #fff; }
  }
`;

const Status = styled.div`
  align-items: center; display: flex; flex-wrap: wrap; gap: 0.8rem 1.4rem; justify-content: space-between; margin: 1rem 0 0.6rem;
  p { color: var(--muted); font-weight: 600; margin: 0; }
  a { color: var(--gold2); font-weight: 600; }
`;

const ProgramCard = styled(Card)`
  display: flex; flex-direction: column;
  .meta { align-items: center; color: var(--muted); display: flex; flex-wrap: wrap; font-size: 0.8rem; font-weight: 600; gap: 0.5rem 0.8rem; justify-content: space-between; margin-bottom: 0.6rem; padding-right: 1.6rem; }
  .meta strong { background: rgba(232, 194, 107, 0.18); border-radius: 999px; color: var(--gold2); font-size: 0.74rem; padding: 0.2rem 0.6rem; }
  h3 { margin-bottom: 0.2rem; }
  .award { color: var(--rose); font-family: ${sans}; font-size: 0.86rem; font-weight: 600; margin: 0 0 1rem; }
  .facts { display: grid; gap: 0.8rem; grid-template-columns: 1fr 1.3fr; margin-bottom: 0.9rem; }
  .facts small { color: var(--gold); display: block; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.14em; margin-bottom: 0.2rem; }
  .facts strong { color: var(--cream); font-family: ${display}; font-size: 1.35rem; font-weight: 600; line-height: 1.2; }
  .venue { font-size: 0.9rem; }
  details { border-top: 1px solid rgba(232, 194, 107, 0.2); margin: 0.4rem 0 1rem; padding-top: 0.7rem; }
  summary { color: var(--gold2); cursor: pointer; font-weight: 600; }
  details p { font-size: 0.92rem; margin: 0.7rem 0 0; }
  .actions { align-items: center; display: flex; flex-wrap: wrap; gap: 0.5rem 1rem; margin-top: auto; padding-top: 0.4rem; }
  .actions a { font-size: 0.9rem; font-weight: 600; }
  .pick { background: transparent; border: 1px solid var(--gold); border-radius: 999px; color: var(--gold2); cursor: pointer; font: inherit; font-size: 0.88rem; font-weight: 700; min-height: 42px; padding: 0 1rem; }
  .pick[aria-pressed="true"] { background: var(--gold); color: #14122a; }
  .pick:disabled { cursor: not-allowed; opacity: 0.4; }
`;

const TableWrap = styled.div`
  ${glass}
  overflow-x: auto;
  padding: 0.4rem;
  table { border-collapse: collapse; min-width: 640px; width: 100%; }
  th, td { border-bottom: 1px solid rgba(232, 194, 107, 0.16); line-height: 1.5; padding: 0.8rem; text-align: left; vertical-align: top; }
  thead th { color: var(--gold2); font-family: ${display}; font-size: 1.05rem; }
  tbody th { color: var(--gold); font-size: 0.74rem; letter-spacing: 0.1em; text-transform: uppercase; width: 8.5rem; }
  td { color: var(--muted); font-size: 0.92rem; }
`;

const Path = styled(Card)`
  .n { color: var(--gold); font-family: ${display}; font-size: 2.4rem; line-height: 1; }
`;

const Note = styled.aside`
  ${glass}
  margin-top: 1.4rem;
  padding: clamp(1.2rem, 3vw, 1.8rem);
  h3 { margin: 0 0 0.7rem; }
  p { color: var(--muted); line-height: 1.7; margin: 0 0 0.9rem; }
  p:last-child { margin-bottom: 0; }
  strong { color: var(--cream); }
  a { color: var(--gold2); }
`;

const Resources = styled.div`
  li { margin: 0 0 0.85rem; }
  ul { list-style: none; margin: 0; padding: 0; }
  li p { font-size: 0.9rem; margin: 0.15rem 0 0; }
  li a { font-weight: 600; }
`;

const sections = [
  ["start", "Start here"], ["finder", "Programs"], ["career", "Career paths"], ["own", "Working for yourself"], ["pay", "Pay & jobs"], ["saved", "Saved links"]
];

const labels = [["Credential", "award"], ["Cost (CAD)", "price"], ["Cost basis", "basis"], ["Duration", "length"], ["Venue", "venue"], ["What you’ll learn", "learn"], ["Where it can lead", "roles"], ["What to check", "check"]];

export default function CareerGuide() {
  const [opts, setOpts] = useState({ goal: "", format: "", budget: "", time: "" });
  const [picked, setPicked] = useState([]); // kept when the filters change
  const results = useMemo(() => match(programs, { goal: opts.goal, format: opts.format, budget: opts.budget ? Number(opts.budget) : "", time: opts.time ? Number(opts.time) : "" }), [opts]);
  const picks = picked.map((id) => programs.find((p) => p.id === id)).filter(Boolean);
  const set = (k) => (e) => setOpts((o) => ({ ...o, [k]: e.target.value }));
  const toggle = (id) => setPicked((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length < 3 ? [...cur, id] : cur));

  return (
    <>
      <Jump aria-label="On this page">
        <Wrap><div className="hub-row">{sections.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</div></Wrap>
      </Jump>
      <Wrap>
        <HeroBox>
          <div>
            <Eyebrow>A little something for Ash ♡</Eyebrow>
            <H1>My psych baby!<br /><em>I’m psyched for you.</em></H1>
            <Lede>
              Okay, I had to. ♡ I got a little carried away looking up programs for you, so I put the useful bits here: what you’d learn, what it costs, and which ones you can do from Vancouver. You already know the hiring and HR world. I wanted to see where else that could take you.
            </Lede>
            <ButtonLink href="#finder">Let’s have a look ↓</ButtonLink>
          </div>
          <aside className="note">
            <span>BOYFRIEND FIELD NOTES</span>
            <div className="mark" aria-hidden="true">♡</div>
            <p>You don’t have to<br />figure it all out today.</p>
            <small>My very unofficial diagnosis: too many tabs open. Prescription: snacks, a little browsing, and absolutely no need to pick a master’s tonight.</small>
          </aside>
        </HeroBox>

        <Section id="start">
          <Reveal>
            <Eyebrow>If you’re still figuring it out</Eyebrow>
            <H2>No need to declare a major over dinner.</H2>
            <Lede>Ash, start with the kind of work you’d actually like to try. You can change your mind as much as you like. I’m not grading this.</Lede>
          </Reveal>
          <Grid cols={2}>
            <Reveal><Card><H3>I want to help teams through big changes.</H3><p>Start with change management or HR integration. Try an onboarding redesign or reorganization project before paying for a longer program.</p><a href="#finder">Compare the short courses and certificates ↓</a></Card></Reveal>
            <Reveal delay={0.06}><Card><H3>I’m curious why people do what they do at work.</H3><p>Look at workplace psychology, talent assessment, or people analytics. Try improving an interview scorecard or helping analyze an employee survey to see which part you enjoy.</p><a href="#finder">Compare the I/O psychology programs ↓</a></Card></Reveal>
            <Reveal><Card><H3>I’d love to work for myself someday.</H3><p>Think about who you’d want as a client: a company with a people problem, a manager who wants coaching, or someone seeking therapy. Those lead to different training and credentials.</p><a href="#own">See what having your own practice could mean ↓</a></Card></Reveal>
            <Reveal delay={0.06}><Card><H3>Honestly, I’m still torn.</H3><p>Pick two job titles below and read a few ads for each. Pay attention to the tasks you’d want to do every week. Then compare the education the ads ask for before committing to tuition.</p><a href="#pay">See pay, employers, and job search terms ↓</a></Card></Reveal>
          </Grid>
        </Section>

        <Rule />

        <Section id="finder">
          <Reveal>
            <Eyebrow>A few places to start</Eyebrow>
            <H2>Time to interview the programs.</H2>
            <Lede>You’ve done enough interviewing. Let’s make the schools do some of the work. Pick what sounds fun, narrow by time and budget, and shortlist up to three.</Lede>
          </Reveal>
          <Form id="filters" onReset={() => setOpts({ goal: "", format: "", budget: "", time: "" })} aria-label="Program filters">
            <label>What interests you most?
              <select name="goal" value={opts.goal} onChange={set("goal")}>
                <option value="">Explore everything</option><option value="psych">Workplace psychology</option><option value="change">Organizational change</option><option value="deal">The people side of M&amp;A</option>
              </select>
            </label>
            <label>How do you want to learn?
              <select name="format" value={opts.format} onChange={set("format")}>
                <option value="">Campus or online</option><option value="campus">Vancouver campus</option><option value="online">Online from Vancouver</option>
              </select>
            </label>
            <label>Budget in CAD
              <select name="budget" value={opts.budget} onChange={set("budget")}>
                <option value="">Any budget</option><option value="2000">Up to $2,000</option><option value="10000">Up to $10,000</option><option value="20000">Up to $20,000</option><option value="60000">Up to $60,000</option>
              </select>
            </label>
            <label>Time to finish
              <select name="time" value={opts.time} onChange={set("time")}>
                <option value="">Any duration</option><option value="1">About a month</option><option value="6">Up to 6 months</option><option value="12">Up to 1 year</option><option value="24">Up to 2 years</option>
              </select>
            </label>
            <GhostButton type="reset">Reset filters</GhostButton>
          </Form>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6, margin: "0.9rem 0 0" }}>
            A little heads-up: I used the Canadian tuition rates and the full-time timeline where I could. If something’s right at your budget, check the extra fees before you fall in love with it.
          </p>
          <Status>
            <p aria-live="polite">{results.length} of {programs.length} programs shown</p>
            {picks.length > 0 && <a href="#compare">See comparison ({picks.length}/3) ↓</a>}
          </Status>
          <Grid cols={2}>
            {results.map((p) => {
              const on = picked.includes(p.id);
              return (
                <ProgramCard key={p.id}>
                  <div className="meta"><span>{p.school}</span>{opts.goal && p.tags.includes(opts.goal) ? <strong>Matches your interest</strong> : null}</div>
                  <H3>{p.name}</H3>
                  <p className="award">{p.award}</p>
                  <div className="facts"><div><small>COST · CAD</small><strong>{p.price}</strong></div><div><small>DURATION</small><strong style={{ fontSize: "1.05rem" }}>{p.length}</strong></div></div>
                  <p className="venue">{p.venue}</p>
                  <p>{p.fit}</p>
                  <details>
                    <summary>Program details</summary>
                    <p><b>Learn:</b> {p.learn}</p>
                    <p><b>Career paths:</b> {p.roles}</p>
                    <p><b>Before applying:</b> {p.check}</p>
                    <p><b>Cost basis:</b> {p.basis}</p>
                  </details>
                  <div className="actions">
                    <button type="button" className="pick" aria-pressed={on} aria-label={`Compare ${p.name} at ${p.school}`} disabled={picked.length >= 3 && !on} onClick={() => toggle(p.id)}>{on ? "✓ Selected" : "+ Compare"}</button>
                    <A href={p.url}>Program ↗</A>
                    <A href={p.fees}>Fees ↗</A>
                    {p.extra ? <A href={p.extra}>Full certificate ↗</A> : null}
                  </div>
                </ProgramCard>
              );
            })}
          </Grid>
          {results.length === 0 && <Card><p>No programs match these limits. Try expanding your budget or duration, or switching delivery format.</p></Card>}
          {picks.length > 0 && (
            <div id="compare" style={{ marginTop: "2.2rem", scrollMarginTop: "130px" }}>
              <H2>Compare your picks</H2>
              <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>Your selections stay here when you change filters.</p>
              <TableWrap tabIndex={0} role="region" aria-label="Comparison table">
                <table>
                  <thead><tr><th scope="col">At a glance</th>{picks.map((p) => <th scope="col" key={p.id}>{p.school}<br />{p.name}</th>)}</tr></thead>
                  <tbody>{labels.map(([label, key]) => <tr key={key}><th scope="row">{label}</th>{picks.map((p) => <td key={p.id}>{p[key]}</td>)}</tr>)}</tbody>
                </table>
              </TableWrap>
              <p style={{ marginTop: "1rem" }}><GhostButton type="button" onClick={() => setPicked([])}>Clear picks</GhostButton></p>
            </div>
          )}
        </Section>

        <Rule />

        <Section id="career">
          <Reveal>
            <Eyebrow>Where this could take you</Eyebrow>
            <H2>What could your work actually look like?</H2>
          </Reveal>
          <Grid cols={3}>
            <Reveal><Path><div className="n">01</div><H3>Study people at work</H3><p>Design better interviews, assess leadership or use employee data to understand what helps teams thrive. Explore talent management, employee experience and people analytics.</p></Path></Reveal>
            <Reveal delay={0.06}><Path><div className="n">02</div><H3>Help teams through change</H3><p>Plan how employees hear about a reorganization, prepare managers for new roles, and measure whether people adopt the changes. Explore change management and organizational development.</p></Path></Reveal>
            <Reveal delay={0.12}><Path><div className="n">03</div><H3>Work on mergers &amp; acquisitions</H3><p>Before a deal closes, assess workforce risks, compensation and retention. After close, help combine teams, onboard employees and coordinate HR changes. Explore HR integration and human capital advisory.</p></Path></Reveal>
          </Grid>
          <Reveal>
            <Grid cols={2}>
              <Card style={{ marginTop: "1.2rem" }}><H3>Before the deal closes</H3><p>The questions are about risk: which key people might leave, what compensation and benefits the two companies promise, and how different the cultures really are.</p></Card>
              <Card style={{ marginTop: "1.2rem" }}><H3>After it closes</H3><p>The work is about people landing well: combining teams, onboarding employees, coordinating HR changes, and telling everyone clearly who reports to whom.</p></Card>
            </Grid>
            <Note>
              <p><strong>Something you could try before committing to school:</strong> Ask to own a piece of a reorganization, onboarding redesign or HR systems rollout. For U.S. clients, look for cross-border projects and exposure to compensation, benefits and workforce planning alongside local specialists. <A href="https://www.mercer.com/en-us/solutions/transformation/mergers-and-acquisitions-advisory/integration-planning-and-execution/">See what HR integration involves ↗</A></p>
            </Note>
          </Reveal>
        </Section>

        <Rule />

        <Section id="own">
          <Reveal>
            <Eyebrow>In case you want to do your own thing</Eyebrow>
            <H2>Okay, but what if you want to be your own boss?</H2>
            <Lede>Ash, I kept thinking about what you said about having your own practice. That could mean a few very different things. The easiest way to sort it out: who would you want calling you, and what would you want them asking for help with?</Lede>
          </Reveal>
          <Grid cols={2}>
            <Reveal><Card><H3>“Our teams just merged. Help.”</H3><p><strong>HR integration or change consulting.</strong> Companies could hire you to help onboard an acquired team, plan employee communications, or figure out why everyone’s confused about who they report to. Start with a change course and try owning a piece of an integration, reorg, or HR systems rollout at work. Later, you could subcontract to a consulting firm or take on a project directly.</p><A href="https://www.mercer.com/en-us/solutions/transformation/mergers-and-acquisitions-advisory/integration-planning-and-execution/">See what integration work looks like ↗</A></Card></Reveal>
            <Reveal delay={0.06}><Card><H3>“Something’s off with how we work.”</H3><p><strong>Organizational development or talent consulting.</strong> You could help employers redesign hiring, run employee surveys, develop managers, or figure out how to make teams work better. Your hiring experience gives you a first service you could try: an interview audit and a better scorecard. An applied I/O master’s is worth exploring if you want to go deeper into assessment and research.</p><A href="https://www.apa.org/education-career/training/careers-applied-psychology-industrial-organizational">See where applied I/O can take you ↗</A></Card></Reveal>
            <Reveal><Card><H3>“I need help figuring out how to lead.”</H3><p><strong>Executive or team coaching.</strong> You might work one-on-one with new managers, coach teams after a restructure, or run leadership workshops. If the conversations are what you’d love most, compare coach training and supervised practice with the I/O route. Coaching and therapy are different services.</p><A href="https://extendedlearning.ubc.ca/programs-credentials/organizational-coaching-certificate">Explore UBC organizational coaching ↗</A></Card></Reveal>
            <Reveal delay={0.06}>
              <Card>
                <H3>“I want help with my mental health.”</H3>
                <p><strong>Clinical or counselling practice.</strong> If you want to see clients for therapy, look into clinical or counselling training and the specific credential you’d need. An I/O master’s or change certificate does not by itself qualify you as a psychologist or therapist. The psychologist title is protected in B.C., and the provincial regulator says psychotherapy licensure is scheduled to take effect November 29, 2027, with the application process expected to open in summer 2027 (both confirmed on its pages on {CHECKED}).</p>
                <p><A href="https://www.grad.ubc.ca/prospective-students/graduate-degree-programs/master-of-arts-counselling-psychology">UBC counselling psychology ↗</A> · <A href="https://psych.ubc.ca/graduate/research-streams/clinical/program-admission-details/">UBC clinical psychology ↗</A> · <A href="https://chcpbc.org/concerns-and-complaints/unauthorized-practice-and-use-of-exlusive-titles/">B.C. protected titles ↗</A> · <A href="https://chcpbc.org/standards-and-resources/legislation/regulating-psychotherapy/">B.C. psychotherapy updates ↗</A></p>
              </Card>
            </Reveal>
          </Grid>
          <Reveal>
            <Note>
              <H3>Could mergers be your way in? Yep.</H3>
              <p>One possible route: <strong>hiring and HR → help with an integration → move into organizational development or people consulting → take on your own clients if you like it.</strong> What you learn on a deal (spotting where cultures clash, supporting leaders, and helping employees find their footing) can carry over to reorganizations and everyday corporate work. If workplace psychology is the part you’re already excited about, you can also go straight toward talent assessment, employee experience, or people analytics. No merger required. Except the snack-budget one, obviously.</p>
              <p><strong>My vote for a first experiment:</strong> try a change project if you’re curious about mergers, or redesign one part of hiring if you’re curious about I/O. If working for yourself sticks as an idea, start with one service you can describe in a sentence. Before taking U.S. clients, check the rules that apply to your services, along with contracts, insurance, and employee data handling. <A href="https://www2.gov.bc.ca/gov/content/employment-business/business/managing-a-business/permits-licences/businesses-incorporated-companies/proprietorships-partnerships">B.C.’s guide to setting up on your own ↗</A></p>
            </Note>
          </Reveal>
        </Section>

        <Rule />

        <Section id="pay">
          <Reveal>
            <Eyebrow>The money and who might hire you</Eyebrow>
            <H2>Okay, but does it pay for snacks?</H2>
            <Lede>I pulled a few real numbers so you don’t have to guess. Job Bank gives you the big picture around Vancouver (its wage pages were last updated in November 2025); the Deloitte numbers come from specific Canadian job ads. Named companies below are places to look, not promises of an opening. If a role catches your eye, check whether it’s still open and whether you could do it from here.</Lede>
          </Reveal>
          <Grid cols={2}>
            <Reveal><Card><H3>Workplace psychology, talent &amp; people analytics</H3><p><strong>Pay:</strong> One <A href="https://careers.deloitte.ca/job/Consultant%2C-Organization-%26-Work-Transformation/133139-en_US/">organization and work transformation consultant posting</A> listed <strong>$58k–$102k</strong> base (the page was still live on {CHECKED}). That’s a consulting example; for in-house work, compare the <A href="https://bc.jobbank.gc.ca/marketreport/wages-occupation/281/BC">Job Bank HR wage data</A> with actual postings.</p><p><strong>Where to look:</strong> People teams at large retailers like <A href="https://corporate.lululemon.com/careers">lululemon</A>, banks, tech companies and universities; assessment vendors and consultancies if you’d prefer multiple clients.</p><p><strong>Search:</strong> Talent management specialist, people analytics analyst, employee experience specialist, assessment consultant.</p></Card></Reveal>
            <Reveal delay={0.06}><Card><H3>Change management &amp; organizational development</H3><p><strong>Pay:</strong> The Lower Mainland’s <A href="https://www.jobbank.gc.ca/wagereport/occupation/299">business management consulting benchmark</A> is <strong>$48/hour median</strong> (about <strong>$100k/year</strong> at 40 hours/week). The low and high benchmarks are $28.75 and $74.52/hour. This group includes more than change management.</p><p><strong>Where to look:</strong> Health authorities like <A href="https://www.vch.ca/en/careers">Vancouver Coastal Health</A>, universities, utilities, telecoms, and consulting firms such as <A href="https://careers.deloitte.ca/">Deloitte</A>. Large systems rollouts and reorganizations are good projects to look for.</p><p><strong>Search:</strong> Change analyst, organizational development specialist, change management consultant, HR transformation.</p></Card></Reveal>
            <Reveal><Card><H3>HR integration &amp; the people side of M&amp;A</H3><p><strong>Pay:</strong> Deloitte examples listed <A href="https://careers.deloitte.ca/job/Senior-Consultant%2C-Deal-Transformation-%26-Post-Merger-Integration/135843-en_US/"><strong>$84k–$126k</strong> for a senior post-merger integration consultant</A> and <A href="https://careers.deloitte.ca/job/Manager%2C-M%26A-Execution%2C-Human-Capital/135624-en_US/"><strong>$101k–$169k</strong> for a human capital M&amp;A manager</A> (both pages were live on {CHECKED}, though a live page doesn’t prove the role is still taking applications). These are experienced roles and the listed ranges exclude potential bonuses.</p><p><strong>Where to look:</strong> Deal advisory practices like <A href="https://jobs-ca.pwc.com/ca/en/c/deals-mergers-and-acquisitions-jobs">PwC Deals</A> and <A href="https://www.mercer.com/en-us/solutions/transformation/mergers-and-acquisitions-advisory/integration-planning-and-execution/">Mercer M&amp;A advisory</A>, plus in-house integration teams at companies that buy other businesses. For U.S. client work, check whether the role can be based in Canada and how much travel it requires.</p><p><strong>Search:</strong> HR integration, people integration, human capital due diligence, deal transformation. Add “HR” or “people” to avoid getting mostly finance jobs.</p></Card></Reveal>
            <Reveal delay={0.06}><Card><H3>Coaching, consulting, or your own practice</H3><p><strong>Pay:</strong> For an in-house role, look up learning and development or leadership development salaries. Independent work has no fixed salary: as an illustration, <strong>$125 × 15 billable hours × 46 weeks = $86,250 in gross annual revenue</strong>. That rate is hypothetical, not a market estimate. Subtract expenses and plan for unpaid time finding clients, cancellations, taxes, and benefits.</p><p><strong>Where to look:</strong> Leadership development teams, coaching firms, HR consulting boutiques, or employers who might hire you directly for one project. If you go independent, the company buying the service is your client.</p><p><strong>Search:</strong> Leadership development specialist, learning and development consultant, team coach, HR consultant.</p></Card></Reveal>
            <Reveal><Card><H3>Clinical or counselling practice</H3><p><strong>Pay:</strong> Lower Mainland Job Bank medians are <A href="https://www.jobbank.gc.ca/wagereport/occupation/2271"><strong>$37.94/hour</strong> for the counselling therapist occupation group</A> (about $79k/year) and <A href="https://www.jobbank.gc.ca/marketreport/wages-occupation/2224/39070"><strong>$48.53/hour</strong> for the counselling psychologist group</A> (about $101k/year). Private session fees are business revenue and don’t tell you take-home pay.</p><p><strong>Where to look:</strong> Health authorities, community mental health nonprofits, group clinics, universities and employee assistance providers. This is a separate training and credential route.</p><p><strong>Search:</strong> Clinical counsellor, mental health therapist, psychologist. <a href="#own">Check the B.C. credential links first.</a></p></Card></Reveal>
          </Grid>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6, marginTop: "1rem" }}>
            For the hourly jobs, I did the math at 40 hours a week for 52 weeks. Your actual pay depends on the hours, benefits, and any bonus. Job Bank figures are broad medians for an area, a job ad is one employer’s offer, and a freelancer’s fees are revenue before expenses and taxes. They aren’t the same thing.
          </p>
        </Section>

        <Rule />

        <Section id="saved">
          <Reveal>
            <Eyebrow>Saved these for you</Eyebrow>
            <H2>I saved you {resourceCount} open tabs.</H2>
            <Lede>You don’t have to read all of these. Start wherever you’re curious. I’ve put the practical stuff here too, so you can go straight to the school when you want a closer look.</Lede>
          </Reveal>
          <Grid cols={2}>
            {resourceGroups.map((g, i) => (
              <Reveal key={g.title} delay={(i % 2) * 0.06}>
                <Card>
                  <H3>{g.title}</H3>
                  <Resources>
                    <ul>
                      {g.items.map(([href, label, note]) => (
                        <li key={href}><A href={href}>{label} ↗</A><p>{note}</p></li>
                      ))}
                    </ul>
                  </Resources>
                </Card>
              </Reveal>
            ))}
          </Grid>
          <Reveal>
            <Note>
              <H3>A little thought before you decide</H3>
              <p>You don’t need to pick the biggest program to take this seriously. If a short course helps you work out what you enjoy, that counts too. And if a master’s is what you want, we can take the time to look at it properly.</p>
              <p>I just wanted you to have somewhere to start. Also, if you ever get into mergers, I’d like to formally propose we combine our snack budgets. Love you ♡</p>
            </Note>
            <Note>
              <p><strong>One last thing, babe:</strong> all prices are in Canadian dollars. I first looked these up on Nov. 11, 2026 and re-checked the main details on {CHECKED}. A few things I couldn’t confirm (Adler’s total price and Royal Roads’ details) are marked as older examples. Before you spend anything, give the school a quick check for the price, dates, and what you need to get in. The jobs are ideas to explore. See which ones make you think, “Wait, I’d actually love that.”</p>
            </Note>
          </Reveal>
        </Section>
      </Wrap>
    </>
  );
}
