import React, {useEffect} from "react";import { Helmet } from 'react-helmet';

import Layout from "../components/layout";
import '../styles/skillStyle.css';
import skill from '../data/skills';
import util from '../data/utilskills';
import devops from '../data/devopskills';
import business from '../data/businessSkills';
import { ExperienceWrapper, WorkWrapper } from "../styles/workStyle.js";
const Skills = () => {
    useEffect(() => {
        const script = document.createElement('script');

        script.src = "https://cdn1.stackshare.io/javascripts/client-code.js";
        script.async = true;
        script.charset = "utf-8";

        document.body.appendChild(script);
      }, []);

    return(
        <Layout className="my-stacks">
      <Helmet title="Skills | Bhimesh Chauhan" />
            <ExperienceWrapper>
                <WorkWrapper>
                    <h1>Skills</h1>
                    <div className="sectionHeader"><h2>Application & Data</h2></div>
                    <div className="techPanel">
                        {
                            skill.map(item => (
                                <article className="techItemWrapper">
                                    <div className="techItem">
                                        <div
                                        className="techItemImage"
                                        style={{
                                            backgroundImage: "url("+ item.icon +")"
                                        }}
                                        ></div>
                                        <div className="techItemPanel">
                                            <div className="techName">
                                                <div className="techTag" style={{backgroundColor: item.experienceColor}}>{item.experience}</div>
                                                <h5 className="techSubTitle">{item.title}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))
                        }

                    </div>

                    <div className="sectionHeader"><h2>Utilities</h2></div>
                    <div className="techPanel">
                        {
                            util.map(item => (
                                <article className="techItemWrapper">
                                    <div className="techItem">
                                        <div
                                        className="techItemImage"
                                        style={{
                                            backgroundImage: "url("+ item.icon +")"
                                        }}
                                        ></div>
                                        <div className="techItemPanel">
                                            <div className="techName">
                                                <div className="techTag" style={{backgroundColor: item.experienceColor}}>{item.experience}</div>
                                                <h5 className="techSubTitle">{item.title}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))
                        }

                    </div>
                    <div className="sectionHeader"><h2>DevOps</h2></div>
                    <div className="techPanel">
                        {
                            devops.map(item => (
                                <article className="techItemWrapper">
                                    <div className="techItem">
                                        <div
                                        className="techItemImage"
                                        style={{
                                            backgroundImage: "url("+ item.icon +")"
                                        }}
                                        ></div>
                                        <div className="techItemPanel">
                                            <div className="techName">
                                                <div className="techTag" style={{backgroundColor: item.experienceColor}}>{item.experience}</div>
                                                <h5 className="techSubTitle">{item.title}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))
                        }

                    </div>
                    <div className="sectionHeader"><h2>Business Tools</h2></div>
                    <div className="techPanel">
                        {
                            business.map(item => (
                                <article className="techItemWrapper">
                                    <div className="techItem">
                                        <div
                                        className="techItemImage"
                                        style={{
                                            backgroundImage: "url("+ item.icon +")"
                                        }}
                                        ></div>
                                        <div className="techItemPanel">
                                            <div className="techName">
                                                <div className="techTag" style={{backgroundColor: item.experienceColor}}>{item.experience}</div>
                                                <h5 className="techSubTitle">{item.title}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))
                        }
                    </div>
                </WorkWrapper>
            </ExperienceWrapper>
        </Layout>
	);
};

export default Skills;
