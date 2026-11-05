import { Link } from "gatsby";
import React from "react";
import styled from "styled-components";

const LinkNav = styled(Link)`
  align-items: center;
  border-radius: 999px;
  color: var(--muted);
  display: inline-flex;
  font-weight: 500;
  min-height: 44px;
  padding: 0 1.05rem;
  text-decoration: none;
  transition: color 0.25s ease, background 0.25s ease;
  :hover {
    background: rgba(255, 255, 255, 0.07);
    color: var(--ink);
  }
  &.active {
    background: rgba(255, 180, 84, 0.16);
    color: var(--accent);
  }
  @media (max-width: 700px) {
    padding: 0 0.8rem;
  }
`;
const NavLink = ({ info }) => (
  <LinkNav
    to={info.path}
    aria-label={info.label}
    title={info.label}
    activeClassName="active"
    partiallyActive={info.path !== "/"}
  >
    {info.icon} <span className="nav-label">{info.label}</span>
  </LinkNav>
);

export default NavLink;
