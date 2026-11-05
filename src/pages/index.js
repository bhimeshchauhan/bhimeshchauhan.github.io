import React from "react";
import AboutBox from "../components/About/AboutBox";
import about from "../data/About";
import {
  UserWrapper,
  UserTitle,
  UserDescription,
  DownloadButton,
  UserTopic,
} from "../styles/bhimeshStyle.js";
import "../styles/bhimeshStyle.css";
import { Link } from "gatsby";
import Layout from "../components/layout";
import ChatComponent from "../components/chat";

const IndexPage = () => {
  return (
    <Layout>
      <UserWrapper>
        <UserTitle>
          Bhimesh <span>Chauhan</span><span className="sr-only">, Lead AI Platform Engineer</span>
        </UserTitle>
        <UserDescription>
          <div>
            <p style={{ marginBottom: "1rem" }}>
              <strong>Lead AI platform engineer and founder.</strong> I built
              Scrubs Co-Pilot, ambient clinical AI that cut clinician
              documentation time by about 80%, and I ship RAG, LLM, payments,
              and IoT platforms end to end with hands-on technical leadership.
            </p>
            <ul className="proof-chips" aria-label="Highlights">
              <li>10+ years shipping production software</li>
              <li>~80% less clinician documentation time (Scrubs Co-Pilot)</li>
              <li>100K+ biomedical artifacts structured (BenchSci)</li>
              <li>80K+ learners served (Preply)</li>
            </ul>
            <div className="cta-row">
              <DownloadButton as={Link} to="/case-studies/">
                View case studies
              </DownloadButton>
              <DownloadButton
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                title="Resume"
              >
                Download Resume
              </DownloadButton>
              <DownloadButton href="mailto:bhimeshchauhan@gmail.com">
                Email me
              </DownloadButton>
            </div>
          </div>
          <video
            src="/coding.mp4"
            aria-hidden="true"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            width="480"
            style={{ maxWidth: "50%", height: "auto", borderRadius: 16 }}
          />
        </UserDescription>
        <UserTopic>
          {about.map((item) => (
            <AboutBox key={item.id} info={item} />
          ))}
        </UserTopic>
      </UserWrapper>
      <ChatComponent />
    </Layout>
  );
};

export default IndexPage;
