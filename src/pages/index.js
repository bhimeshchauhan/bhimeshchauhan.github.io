import React from "react";
import BhimeshIcon from "../assets/images/coding.gif";
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
import Layout from "../components/layout";
import ChatComponent from "../components/chat";

const IndexPage = () => {
  return (
    <Layout>
      <UserWrapper>
        <UserTitle>
          Bhimesh <span>Chauhan</span>
        </UserTitle>
        <UserDescription>
          <div>
            <p>
              Lead software engineer and founder building production AI platforms
              end to end: from ambient clinical documentation to research
              intelligence, payments, IoT, and SaaS. I pair RAG and LLM systems
              with distributed full-stack architecture, reliable operations, and
              hands-on technical leadership.
            </p>
            <DownloadButton
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              title="Resume"
            >
              Download Resume
            </DownloadButton>
          </div>
          <img
            src={BhimeshIcon}
            alt="Bhimesh Chauhan profile hero animation"
            loading="eager"
            fetchPriority="high"
            decoding="async"
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
