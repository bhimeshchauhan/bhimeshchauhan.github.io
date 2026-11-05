import { Link } from "gatsby";
import React from "react";
import styled from "styled-components";

const Box = styled.div`
  min-height: 287px;
  border-radius: 20px;
  background: linear-gradient(145deg, rgba(95, 113, 177, 0.33), rgba(21, 33, 92, 0.58));
  border: 1px solid rgba(214, 231, 255, 0.24);
  padding: 3% 2%;
  margin-right: 3%;
  margin-bottom: 3%;
  width: 30%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  transition: border-color 0.3s ease-out;
  :hover {
    border-color: rgba(163, 201, 255, 0.65);
    transition: border-color 0.3s;
  }
  :last-of-type {
    margin-right: 0;
  }
  p {
    color: #e2f2f7;
  }
  h3 {
    color: #ffffff;
    font-weight: 600;
  }
  a {
    margin-top: auto;
    color: #ffffff;
    font-weight: 600;
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
