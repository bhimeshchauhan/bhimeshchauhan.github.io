import React from 'react'
import "../styles/stepper.css";
import goal from "../data/Goals";
import {
	ExperienceWrapper,
	WorkWrapper,
	Stepper,
	StepperHead
} from "../styles/workStyle.js";
import Layout from "../components/layout";

const BlogLayout = () => (
	<Layout>
		<ExperienceWrapper>
			<WorkWrapper>
				<h1>Goals</h1>
				<div className="experience-stepper">
					{goal.map(item => (
						<div key={item.id} className="step">
							<div>
								<div className="circle" />
								<div className="line" />
							</div>
							<Stepper>
								<StepperHead>
									<div>
										<a
											href={item.companyLink}
											// target="_blank"
										>
											{item.name}
										</a>
										<ul>
										    {item.todo.map(terms => (
										        <li style={terms.fin ?{textDecorationLine: 'line-through', textDecorationStyle: 'solid'}: {}}>
										            {terms.desc}
										        </li>
										    ))}
										</ul>
									</div>
								</StepperHead>
							</Stepper>
						</div>
					))}
				</div>
			</WorkWrapper>
		</ExperienceWrapper>
	</Layout>
)

export default BlogLayout
