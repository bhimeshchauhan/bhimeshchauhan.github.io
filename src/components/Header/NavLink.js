import { Link } from "gatsby";
import React from "react";
import styled from "styled-components";

const LinkNav = styled(Link)`
  color: #e2f2f7;
  margin-right: 35px;
  transition: color 0.2s ease-out;
  text-decoration: none;
  :hover {
    color: #7fa1e8;
    transition: color 0.2s;
  }
  &.active {
    color: #7fa1e8;
  }
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  @media (max-width: 700px) {
    margin-right: 14px;
    :last-of-type {
      display: flex;
    }
  }
`;
const NavLink = ({ info }) => (
  <LinkNav to={info.path} aria-label={info.label} title={info.label} activeClassName="active" partiallyActive={info.path !== "/"}>
    {info.icon} <span className="nav-label">{info.label}</span>
  </LinkNav>
);

export default NavLink;
