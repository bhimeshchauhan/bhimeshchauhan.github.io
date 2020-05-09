import React from "react";
import "../../styles/backButton.css";
import {navigate} from 'gatsby'

const BackButton = () => (
  <svg
    width="80px"
    height="100px"
    onClick={(linkTo) => {navigate("/")}}
    className="backButton">
    <circle cx="70" cy="50" r="3"/>
    <circle cx="60" cy="40" r="3"/>
    <circle cx="60" cy="60" r="3"/>
    <circle cx="50" cy="30" r="3"/>
    <circle cx="50" cy="70" r="3"/>
    <circle cx="40" cy="20" r="3"/>
    <circle cx="40" cy="80" r="3"/>
    <circle cx="40" cy="30" r="2" className="middle"/>
    <circle cx="40" cy="70" r="2" className="middle"/>
    <circle cx="50" cy="40" r="2" className="middle"/>
    <circle cx="50" cy="60" r="2" className="middle"/>
    <circle cx="60" cy="50" r="2" className="middle"/>
    <circle cx="50" cy="50" r="1" className="back"/>
    <circle cx="40" cy="40" r="1" className="back"/>
    <circle cx="40" cy="60" r="1" className="back"/>
    <circle cx="30" cy="30" r="1" className="back"/>
    <circle cx="30" cy="70" r="1" className="back"/>
</svg>
);

export default BackButton;
