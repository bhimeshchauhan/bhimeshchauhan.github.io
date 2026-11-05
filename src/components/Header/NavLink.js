import { Link } from "gatsby";
import React from "react";
import styled from "styled-components";

const LinkNav = styled(Link)`
  color: var(--ink);
  position: relative;
  margin-right: 35px;
  transition: color 0.2s ease-out;
  text-decoration: none;
  :hover {
    color: var(--accent);
  }
  &.active {
    color: var(--accent);
  }
  .nav-label::after {
    background: var(--accent);
    bottom: -2px;
    content: "";
    height: 2px;
    left: 0;
    position: absolute;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    width: 100%;
  }
  :hover .nav-label::after,
  &.active .nav-label::after {
    transform: scaleX(1);
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
