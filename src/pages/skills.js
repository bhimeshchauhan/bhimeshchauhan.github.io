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
              <div className="skillGrid">
                {group.skills.map((item) => (
                  <article className="skillCard" key={item.title}>
                    <div className="skillIconFrame">
                      <img
                        src={item.icon}
                        alt=""
                        className="skillIcon"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                          event.currentTarget.parentElement.dataset.fallback = item.title.slice(0, 2);
                        }}
                      />
                    </div>
                    <div className="skillCardBody">
                      <span className={`skillLevel skillLevel--${item.level.toLowerCase().replaceAll(" ", "-")}`}>
                        {item.level}
                      </span>
                      <h3>{item.title}</h3>
                      <p>{item.detail}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </WorkWrapper>
    </ExperienceWrapper>
  </Layout>
);

export default Skills;
