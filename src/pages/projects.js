import React from "react";
import "../styles/tabs.css";
import proProjects from "../data/ProProjects";
import ProjectBox from "../components/Projects/ProjectBox";
import { ProjectsWrapper, ProjectsSection } from "../styles/projectsStyle.js";
import Layout from "../components/layout";

const Projects = () => (
  <Layout seo={{ title: "Projects", description: "Products Bhimesh Chauhan has architected and shipped: clinical AI, RAG systems, payments, IoT, and real-time data platforms." }}>
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
