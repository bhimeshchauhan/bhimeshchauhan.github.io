import React from "react";
import PropTypes from "prop-types";

const Footer = ({ footerClass }) => (
	<div className={`defaultFooter ${footerClass}`}>
		<p>
			This site is hosted on{" "}
			<a
				href=""
				target="_blank"
			>
				Github
			</a>{" "}
			| Designer{" "}
			<a href="" target="_blank">
				Bhimesh
			</a>
		</p>
	</div>
);
Footer.propTypes = {
	footerClass: PropTypes.string
};
export default Footer;
