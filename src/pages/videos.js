import React from "react";
import "../styles/tabs.css";
import videos from "../data/VideoLinks";
import VideoBox from "../components/Videos/VideoBox";
import { ProjectsWrapper, ProjectsSection } from "../styles/projectsStyle.js";
import Layout from "../components/layout";

const Videos = () => (
  <Layout>
    <ProjectsWrapper>
      <ProjectsSection>
        {videos.map((item) => (
          <VideoBox key={item.id} info={item} iframe={item.iframe} />
        ))}
      </ProjectsSection>
    </ProjectsWrapper>
  </Layout>
);

export default Videos;
