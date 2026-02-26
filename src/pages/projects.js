import React from "react";import { Helmet } from 'react-helmet';

import "../styles/tabs.css";
import proProjects from "../data/ProProjects";
import ProjectBox from "../components/Projects/ProjectBox";
import { ProjectsWrapper, ProjectsSection } from "../styles/projectsStyle.js";
import Layout from "../components/layout";

const Projects = () => (
  <Layout>
      <Helmet title="Projects | Bhimesh Chauhan" />
    <ProjectsWrapper>
      <ProjectsSection>
        {proProjects.map((item) => (
          <ProjectBox key={item.id} info={item} iframe={item.iframe} />
        ))}
      </ProjectsSection>
    </ProjectsWrapper>
  </Layout>
);

export default Projects;
