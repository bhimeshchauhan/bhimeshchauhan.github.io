import React, {useEffect} from "react";
import Layout from "../components/layout";
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
            <ExperienceWrapper>
                <WorkWrapper>
                    <h1>Skills</h1>
                    <a
                        frameBorder="0"
                        data-theme="light"
                        data-layers="1,2,3,4"
                        data-stack-embed="true"
                        href="https://embed.stackshare.io/stacks/embed/6210fd28c5d2f9a1d3251ca79032f7"
                     ></a>
                </WorkWrapper>
            </ExperienceWrapper>
        </Layout>
	);
};

export default Skills;
