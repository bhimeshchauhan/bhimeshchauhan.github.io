import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faBrain, faProjectDiagram, faComments, faBlog, faBullseye, faAddressBook } from '@fortawesome/free-solid-svg-icons'

const home = <FontAwesomeIcon className="fa-icon" icon={ faHome } />;
const brain = <FontAwesomeIcon className="fa-icon" icon={ faBrain } />;
const projects = <FontAwesomeIcon className="fa-icon" icon={ faProjectDiagram } />;
const recommendation = <FontAwesomeIcon className="fa-icon" icon={ faComments } />;
const blog = <FontAwesomeIcon className="fa-icon" icon={ faBlog } />;
const goals = <FontAwesomeIcon className="fa-icon" icon={ faBullseye } />;
const contact = <FontAwesomeIcon className="fa-icon" icon={ faAddressBook } />;
export default [
  {
    icon: home,
    label: 'Home',
    path: '/bhimesh',
  },
  {
    icon: brain,
    label: 'Experience',
    path: '/experience',
  },
  {
    icon: projects,
    label: 'Projects',
    path: '/projects',
  },
  {
    icon: recommendation,
    label: 'Recommendation',
    path: '/recommendation',
  },
  {
    icon: blog,
    label: 'Blog',
    path: '/blog',
  },
  {
    icon: goals,
    label: 'Goals-2020',
    path: '/goals',
  },
  {
    icon: contact,
    label: 'Contact',
    path: '/contact',
  }
]
