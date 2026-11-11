import React from "react";
import PropTypes from "prop-types";

const Footer = ({ footerClass }) => (
	<footer className={`defaultFooter ${footerClass}`}>
		<p>
			<a href="mailto:bhimeshchauhan@gmail.com">Email</a> |{" "}
			<a href="https://www.linkedin.com/in/bhimeshchauhan" target="_blank" rel="noopener noreferrer">LinkedIn</a> |{" "}
			<a href="https://github.com/bhimeshchauhan" target="_blank" rel="noopener noreferrer">GitHub</a> |{" "}
			<a href="/resume/">Resume</a> (<a href="/resume.pdf" target="_blank" rel="noopener noreferrer">PDF</a>)
		</p>
		<p>
			<a href="/skills/">Skills</a> | <a href="/recommendation/">Recommendations</a> | <a href="/goals/">Goals</a> | <a href="/evidence/">Evidence</a> | <a href="/activity/">Activity</a> | <a href="/hire/">Hire</a>
		</p>
		<p>&#9400; {new Date().getFullYear()} Bhimesh Chauhan</p>
	</footer>
);
Footer.propTypes = {
	footerClass: PropTypes.string
};
export default Footer;
