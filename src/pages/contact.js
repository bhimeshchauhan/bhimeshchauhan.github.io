import React from "react";
import styled from "styled-components";
import { Link } from "gatsby";
import Layout from "../components/layout";
import ContactForm from "../components/Contact/ContactForm";
import { BOOKING_URL, OWNER_EMAIL, mailtoLink, whatsappLink } from "../utils/connect";

const display = `"Space Grotesk", "Inter", sans-serif`;

const Wrap = styled.div`
  margin: 1rem auto 2rem;
  max-width: 1080px;
  width: 100%;
  h1 { color: var(--ink); font-family: ${display}; font-size: clamp(2.2rem, 6vw, 3.8rem); font-weight: 700; letter-spacing: -0.04em; line-height: 1.02; margin: 1rem 0 0.6rem; }
  .lede { color: var(--muted); font-size: clamp(1.02rem, 2vw, 1.2rem); line-height: 1.6; margin: 0 0 2rem; max-width: 44rem; }
  .grid { align-items: start; display: grid; gap: 1.25rem; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.4fr); }
  @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } .grid > aside { order: 2; } }
`;
const Side = styled.aside`
  display: grid;
  gap: 1rem;
  @media (min-width: 901px) { position: sticky; top: 6.5rem; }
  .card { background: var(--card); border: 1px solid var(--line); border-radius: 22px; padding: 1.3rem 1.4rem; }
  h2 { color: var(--ink); font-family: ${display}; font-size: 1.1rem; letter-spacing: -0.01em; margin: 0 0 0.7rem; }
  ul { display: grid; gap: 0.1rem; list-style: none; margin: 0; padding: 0; }
  li a { align-items: center; color: var(--ink); display: flex; gap: 0.6rem; min-height: 44px; text-decoration: none; }
  li a span { color: var(--muted); font-size: 0.85rem; }
  li a:hover { color: var(--accent); }
  p { color: var(--muted); line-height: 1.55; margin: 0; }
  p a { color: var(--accent); text-underline-offset: 3px; }
  .fact { color: var(--ink); margin-top: 0.5rem; }
`;

const Contact = () => (
  <Layout seo={{ title: "Contact", description: "Contact Bhimesh Chauhan about lead, staff or forward-deployed AI platform engineering roles, contracts and collaborations. Based in Canada." }}>
    <Wrap>
      <h1>Get in touch</h1>
      <p className="lede">Hiring, a contract, a collaboration or just a hello. Use the form for the fastest useful reply, or reach me directly.</p>
      <div className="grid">
        <Side>
          <div className="card">
            <h2>Reach me directly</h2>
            <ul>
              {BOOKING_URL && <li><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a call <span>30 minutes</span></a></li>}
              <li><a href={mailtoLink()}>Email <span>{OWNER_EMAIL}</span></a></li>
              <li><a href="https://www.linkedin.com/in/bhimeshchauhan" target="_blank" rel="noopener noreferrer">LinkedIn <span>/in/bhimeshchauhan</span></a></li>
              <li><a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp <span>click to chat</span></a></li>
              <li><a href="https://github.com/bhimeshchauhan" target="_blank" rel="noopener noreferrer">GitHub <span>/bhimeshchauhan</span></a></li>
            </ul>
          </div>
          <div className="card">
            <h2>Good to know</h2>
            <p>Based in Canada. Permanent resident, authorized to work in Canada for any employer, no sponsorship needed. I have lived and worked in Canada, the United States and Spain.</p>
            <p className="fact">Roles of interest: forward deployed, staff or principal AI platform, and lead or founding engineering.</p>
          </div>
          <div className="card">
            <h2>Before you write</h2>
            <p>The <Link to="/hire/">role-fit page</Link> maps those roles to shipped work, and the assistant on every page answers questions about my experience.</p>
          </div>
        </Side>
        <ContactForm />
      </div>
    </Wrap>
  </Layout>
);

export default Contact;
