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
              Full-Stack Engineer specializing in Computer Vision and Graphic
              design with expertise in Machine Learning. Elevate your team's
              capabilities with my proven track record in creating innovative
              solutions. Let's discuss how I can contribute to your company's
              success.
            </p>
            <DownloadButton
              href="/resume.pdf"
              download
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
