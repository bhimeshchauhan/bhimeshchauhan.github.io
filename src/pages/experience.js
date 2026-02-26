import React from "react";import { Helmet } from 'react-helmet';

import "../styles/stepper.css";
import work from "../data/Work";
import {
	ExperienceWrapper,
	WorkWrapper,
	Stepper,
	StepperHead,
	LogoLink,
	StepperDesc
} from "../styles/workStyle.js";
import Layout from "../components/layout";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

const Experience = () => (
	<Layout>
      <Helmet title="Experience | Bhimesh Chauhan" />
		<ExperienceWrapper>
			<WorkWrapper>
				<h1>Professional Experience</h1>
				<h2>Core Engineering Competencies & AI Experience</h2>
				<div className="experience-stepper">
					{work.map(item => (
						<div key={item.id} className="step">
							<div>
								<div className="circle" />
								<div className="line" />
							</div>
							<Stepper>
								<StepperHead>
									<div>
										<h3>{item.designation}</h3>
										<a
											href={item.companyLink}
											// target="_blank"
										>
											{item.name}
										</a>
										<p>{item.dated}</p>
									</div>
									<LogoLink href={item.companyLink}>
										<img
											src={item.logo}
											alt={`${item.name} logo where Bhimesh Chauhan led engineering initiatives`}
											width="155px"
										/>
									</LogoLink>
								</StepperHead>
								<StepperDesc>
									<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
										{(item.description || "").replace(/<br\s*\/?>/gi, "\n\n")}
									</ReactMarkdown>
								</StepperDesc>
							</Stepper>
						</div>
					))}
				</div>
			</WorkWrapper>
		</ExperienceWrapper>
	</Layout>
);

export default Experience;
