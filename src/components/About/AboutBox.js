import { Link } from "gatsby";
import React from "react";
import styled from "styled-components";

const Box = styled.div`
  min-height: 287px;
  border-radius: 8px;
  background-color: #17191b;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  padding: 3% 2%;
  margin-right: 3%;
  margin-bottom: 3%;
  width: 30%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.5s ease-out;
  :hover {
    box-shadow: 0 8px 17px 2px rgba(0, 0, 0, 0.14),
      0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.5s;
  }
  :last-of-type {
    margin-right: 0;
  }
  p {
    color: #e2f2f7;
  }
  h3 {
    color: #7fa1e8;
  }
  a {
    margin-top: auto;
    color: #7fa1e8;
    text-decoration: none;
  }
  @media (max-width: 1170px) {
    width: 100%;
    min-height: auto;
    max-width: 100%;
    padding: 5%;
    margin: 3% 0;
  }

  @media (max-width: 700px) {
    width: 100%;
    min-height: auto;
    padding: 5%;
  }
`;

const AboutBox = ({ info }) => (
  <Box>
    <h3>{info.title}</h3>
    <p> {info.description}</p>
    <Link to={info.path}>Read more &#x3e;</Link>
  </Box>
);

export default AboutBox;
