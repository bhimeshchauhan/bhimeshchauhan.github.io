import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faBrain, faProjectDiagram, faComments, faBlog, faBullseye, faAddressBook, faChartLine } from '@fortawesome/free-solid-svg-icons'

const home = <FontAwesomeIcon className="fa-icon fa-fw" icon={ faHome } />;
const brain = <FontAwesomeIcon className="fa-icon fa-fw" icon={ faBrain } />;
const skills = <FontAwesomeIcon className="fa-icon fa-fw" icon={ faChartLine } />;
const projects = <FontAwesomeIcon className="fa-icon fa-fw " icon={ faProjectDiagram } />;
const recommendation = <FontAwesomeIcon className="fa-icon fa-fw " icon={ faComments } />;
const blog = <FontAwesomeIcon className="fa-icon fa-fw " icon={ faBlog } />;
const goals = <FontAwesomeIcon className="fa-icon fa-fw " icon={ faBullseye } />;
const contact = <FontAwesomeIcon className="fa-icon fa-fw " icon={ faAddressBook } />;
export default [
  {
    icon: home,
    label: 'Home',
    path: '/bhimesh',
  },
  {
    icon: skills,
    label: 'Skills',
    path: '/skills',
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
    label: 'Goals',
    path: '/goals',
  },
  {
    icon: contact,
    label: 'Contact',
    path: '/contact',
  }
]
