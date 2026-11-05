import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import blueBg from '../assets/images/blue-bg.png'
import { Location } from '@reach/router'
import Seo from './Seo'

// import Header from '../components/Header/Header'
// import Footer from '../components/Footer/Footer'

import '@fontsource/signika/300.css'
import '@fontsource/signika/400.css'
import '@fontsource/signika/600.css'
import '@fontsource/signika/700.css'
import '@fontsource/montserrat/400.css'
import '@fontsource/inter/700.css'
import '@fontsource/maven-pro/400.css'
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
  padding: 8vw 8vw 0;
  position: relative;
  display: flex;
  flex-direction: column;
  > main { flex: 1; }
  @media (max-width: 700px) {
    min-height: 100vh;
    height: auto;
    overflow-x: hidden;
  }
`;

const Layout = ({ children, seo = {} }) => (
  <>
    <Location>
        {({ location }) => {
          return <>
            <Seo {...seo} pathname={seo.pathname || location.pathname} />
            <Wrapper className={location.pathname === "/" ? "cutBackground" :''}>
              <a className="skip-link" href="#main">Skip to content</a>
              <Header />
              <main id="main">{children}</main>
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
