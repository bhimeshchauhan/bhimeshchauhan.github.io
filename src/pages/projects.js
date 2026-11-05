import React from "react";
import "../styles/tabs.css";
import proProjects from "../data/ProProjects";
import ProjectBox from "../components/Projects/ProjectBox";
import { ProjectsWrapper, ProjectsSection, ProjectsIntro } from "../styles/projectsStyle.js";
import Layout from "../components/layout";
import { projectsSchema } from "../utils/schema";

const Projects = () => (
  <Layout seo={{ title: "Projects", description: "Products Bhimesh Chauhan has architected and shipped: clinical AI, RAG systems, payments, IoT, and real-time data platforms.", structuredData: projectsSchema(proProjects) }}>
    <ProjectsWrapper>
      <ProjectsIntro>
        <h1>Projects</h1>
        <p>Products I have architected and shipped, from clinical AI and RAG systems to IoT, games and graphics experiments.</p>
      </ProjectsIntro>
      <ProjectsSection>
        {proProjects.map((item) => (
          <ProjectBox key={item.id} info={item} iframe={item.iframe} />
        ))}
      </ProjectsSection>
    </ProjectsWrapper>
  </Layout>
);

export default Projects;
