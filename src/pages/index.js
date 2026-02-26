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
              Engineering leader who builds and scales AI-powered products — from
              clinical documentation platforms to enterprise ML systems. I combine
              deep technical execution with the ability to hire, mentor, and ship
              across full-stack, ML, and infrastructure. Currently open to Lead,
              Staff, and Engineering Manager roles where I can own technical
              direction and grow high-performing teams.
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
