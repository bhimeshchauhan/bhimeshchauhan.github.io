import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faTools, faComments, faBlog, faBullseye, faAddressBook, faBusinessTime, faLaptopCode } from '@fortawesome/free-solid-svg-icons'

const home = <FontAwesomeIcon className="fa-icon fa-fw" icon={ faHome } />;
const business = <FontAwesomeIcon className="fa-icon fa-fw" icon={ faBusinessTime } />;
const projects = <FontAwesomeIcon className="fa-icon fa-fw" icon={ faLaptopCode } />;
const skills = <FontAwesomeIcon className="fa-icon fa-fw " icon={ faTools } />;
const recommendation = <FontAwesomeIcon className="fa-icon fa-fw " icon={ faComments } />;
const blog = <FontAwesomeIcon className="fa-icon fa-fw " icon={ faBlog } />;
const goals = <FontAwesomeIcon className="fa-icon fa-fw " icon={ faBullseye } />;
const contact = <FontAwesomeIcon className="fa-icon fa-fw " icon={ faAddressBook } />;
export default [
  {
    icon: home,
    label: 'Home',
    path: '/',
  },
  {
    icon: business,
    label: 'Experience',
    path: '/experience/',
  },
  {
    icon: projects,
    label: 'Projects',
    path: '/projects/',
  },
  {
    icon: skills,
    label: 'Skills',
    path: '/skills/',
  },
  {
    icon: recommendation,
    label: 'Recommendation',
    path: '/recommendation/',
  },
  {
    icon: blog,
    label: 'Blog',
    path: '/blog/',
  },
  {
    icon: goals,
    label: 'Goals',
    path: '/goals/',
  },
  {
    icon: contact,
    label: 'Contact',
    path: '/contact/',
  }
]
