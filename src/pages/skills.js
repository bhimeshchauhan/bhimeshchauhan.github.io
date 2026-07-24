import React from "react";
import Layout from "../components/layout";
import "../styles/skillStyle.css";
import skillGroups from "../data/skills";
import { ExperienceWrapper, WorkWrapper } from "../styles/workStyle.js";

const Skills = () => (
  <Layout className="my-stacks">
    <ExperienceWrapper>
      <WorkWrapper>
        <h1>Capabilities</h1>
        <p className="skillsIntro">
          Lead-level product and platform engineering across production AI, distributed systems, and full-stack delivery. My strongest work connects technical depth with customer outcomes, operational reliability, and clear engineering leadership.
        </p>

        <div className="skillsGroups">
          {skillGroups.map((group) => (
            <section className="skillGroup" key={group.title}>
              <div className="sectionHeader">
                <h2>{group.title}</h2>
                <p>{group.summary}</p>
              </div>
              <ul className="skillList">
                {group.skills.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </WorkWrapper>
    </ExperienceWrapper>
  </Layout>
);

export default Skills;
