import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import blueBg from '../assets/images/blue-bg.png'
import { Location } from '@reach/router'
import Seo from './Seo'

// import Header from '../components/Header/Header'
// import Footer from '../components/Footer/Footer'

import '../layouts/index.css'
import Header from './Header/header';
import Footer from './Footer/footer';

const Wrapper = styled.div`
  background-image: url(${blueBg});
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh;
  height: auto;
  background-position: bottom;
  padding: 8%;
  position: relative;
  @media (max-width: 700px) {
    min-height: 100vh;
    height: auto;
    overflow: hidden;
  }
`;

const Layout = ({ children, seo = {} }) => (
  <>
    <Location>
        {({ location }) => {
          return <>
            <Seo {...seo} pathname={seo.pathname || location.pathname} />
            <Wrapper className={location.pathname === "/" ? "cutBackground" :''}>
              <Header />
              {children}
              <Footer footerClass={location.pathname === "/" ? 'footerInitial' :'footerAbsolute'} />
            </Wrapper>
          </>
        }}
    </Location>
  </>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  seo: PropTypes.object,
}

export default Layout
