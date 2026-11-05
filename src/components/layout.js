import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { motion, MotionConfig } from 'framer-motion'
import { Location } from '@reach/router'
import Seo from './Seo'
import { ScrollProgress } from './motion/primitives'

import '@fontsource/signika/300.css'
import '@fontsource/signika/400.css'
import '@fontsource/signika/600.css'
import '@fontsource/signika/700.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/montserrat/400.css'
import '@fontsource/inter/700.css'
import '@fontsource/maven-pro/400.css'
import '../layouts/index.css'
import Header from './Header/header';
import Footer from './Footer/footer';

const Wrapper = styled.div`
  background: transparent;
  width: 100%;
  min-height: 100vh;
  height: auto;
  padding: 2rem 8vw 0;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: clip;
  > main { flex: 1; position: relative; z-index: 1; }
  > nav, > footer { position: relative; z-index: 1; }
`;

// Slow, dim colour blobs behind everything.
const Ambient = styled.div`
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  position: fixed;
  z-index: 0;
  .blob {
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.3;
    position: absolute;
  }
  .a { background: #3b4bd8; height: 46vmax; left: -12vmax; top: -14vmax; width: 46vmax; }
  .b { background: #ff9d3a; height: 34vmax; opacity: 0.12; right: -10vmax; top: 30vh; width: 34vmax; }
  .c { background: #7c3aed; bottom: -16vmax; height: 40vmax; left: 25vw; opacity: 0.16; width: 40vmax; }
`;

const drift = (x, y, d) => ({
  animate: { x: [0, x, 0], y: [0, y, 0] },
  transition: { duration: d, repeat: Infinity, ease: 'easeInOut' },
});

const Layout = ({ children, seo = {} }) => (
  <MotionConfig reducedMotion="user">
    <Location>
        {({ location }) => {
          return <>
            <Seo {...seo} pathname={seo.pathname || location.pathname} />
            <ScrollProgress />
            <Ambient aria-hidden="true">
              <motion.div className="blob a" {...drift(60, 40, 48)} />
              <motion.div className="blob b" {...drift(-50, 40, 56)} />
              <motion.div className="blob c" {...drift(40, -50, 64)} />
            </Ambient>
            <Wrapper>
              <a className="skip-link" href="#main">Skip to content</a>
              <Header />
              <motion.main
                id="main"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {children}
              </motion.main>
              <Footer footerClass="" />
            </Wrapper>
          </>
        }}
    </Location>
  </MotionConfig>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  seo: PropTypes.object,
}

export default Layout
