import React from "react";
import { Link } from "gatsby";
import Layout from "../components/layout";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
  color: #e2f2f7;
`;

const ErrorCode = styled.h1`
  font-size: 6rem;
  margin: 0;
  color: #7fa1e8;
  font-weight: 700;
  line-height: 1;
`;

const Message = styled.p`
  font-size: 1.25rem;
  margin: 1rem 0 2rem;
  color: #a0aec0;
`;

const NavLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-top: 1rem;
`;

const NavLink = styled(Link)`
  color: #7fa1e8;
  text-decoration: none;
  padding: 8px 16px;
  border: 1px solid #7fa1e8;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #7fa1e8;
    color: #1d1e20;
  }
`;

const NotFoundPage = () => (
  <Layout>
    <Container>
      <ErrorCode>404</ErrorCode>
      <Message>This page doesn't exist — but these do:</Message>
      <NavLinks>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/experience/">Experience</NavLink>
        <NavLink to="/projects/">Projects</NavLink>
        <NavLink to="/skills/">Skills</NavLink>
        <NavLink to="/blog/">Blog</NavLink>
        <NavLink to="/contact/">Contact</NavLink>
      </NavLinks>
    </Container>
  </Layout>
);

export default NotFoundPage;
