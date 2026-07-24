import React from "react";
import Layout from "../components/layout";
import "../styles/skillStyle.css";
import skillGroups from "../data/skills";
import { ExperienceWrapper, WorkWrapper } from "../styles/workStyle.js";

const showIconFallback = (event, title) => {
  event.currentTarget.style.display = "none";
  event.currentTarget.closest(".skillIconFrame").dataset.fallback = title.slice(0, 2);
};

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
                {group.skills.map((item) => {
                  const isIconCluster = Array.isArray(item.icons) && item.icons.length > 0;

                  return (
                    <article className="skillCard" key={item.title}>
                      <div className={`skillIconFrame${isIconCluster ? " skillIconFrame--cluster" : ""}`}>
                        {isIconCluster ? (
                          <div className="skillIconCluster">
                            {item.icons.map((icon, index) => {
                              const bubbleOffset = [-0.28, 0.22, -0.1][index % 3];

                              return (
                                <span
                                  className="skillBubble"
                                  role="img"
                                  aria-label={`${item.title} technology icon ${index + 1} of ${item.icons.length}`}
                                  tabIndex="0"
                                  key={icon}
                                  style={{
                                    "--bubble-delay": `${index * -0.8}s`,
                                    "--bubble-offset": `${bubbleOffset}rem`,
                                  }}
                                >
                                  <span className="skillBubbleSurface">
                                    <img
                                      src={icon}
                                      alt=""
                                      className="skillClusterIcon"
                                      loading="lazy"
                                      onError={(event) => showIconFallback(event, item.title)}
                                    />
                                  </span>
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <img
                            src={item.icon}
                            alt=""
                            className="skillIcon"
                            loading="lazy"
                            onError={(event) => showIconFallback(event, item.title)}
                          />
                        )}
                      </div>
                      <div className="skillCardBody">
                        <span className={`skillLevel skillLevel--${item.level.toLowerCase().replaceAll(" ", "-")}`}>
                          {item.level}
                        </span>
                        <h3>{item.title}</h3>
                        <p>{item.detail}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </WorkWrapper>
    </ExperienceWrapper>
  </Layout>
);

export default Skills;
