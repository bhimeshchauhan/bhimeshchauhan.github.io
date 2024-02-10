import React from "react";
import styled from "styled-components";
import { navigate } from "gatsby";

const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #e55376;
  color: white;
  margin-bottom: 20px;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 2% 5%;
  width: 80%;
  margin-bottom: 5%;
  position: absolute;
  top: 10%;
`;

const NavItem = styled.span`
  cursor: pointer;
`;

const LoluNav = () => {
  const nav = [
    {
      name: "Happy Valentine's 2024",
      link: "/lolu",
    },
    {
      name: "Game",
      link: "/lolu/game",
    },
    {
      name: "Video",
      link: "/lolu/video",
    },
  ];
  return (
    <Nav>
      {nav.map((link, index) => (
        <NavItem
          key={index}
          onClick={() => {
            navigate(link.link);
          }}
        >
          {link.name}
        </NavItem>
      ))}
    </Nav>
  );
};

export default LoluNav;
