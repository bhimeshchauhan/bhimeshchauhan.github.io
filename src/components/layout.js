import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { motion, MotionConfig } from 'framer-motion'
import { Location } from '@reach/router'
import Seo from './Seo'
import { ScrollProgress } from './motion/primitives'

import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/space-grotesk/latin-500.css'
import '@fontsource/space-grotesk/latin-700.css'
import '@fontsource/inter/latin-700.css'
import '../layouts/index.css'
import Header from './Header/header';
import Footer from './Footer/footer';
import ChatComponent from './chat';

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

const Layout = ({ children, seo = {} }) => (
  <MotionConfig reducedMotion="user">
    <Location>
        {({ location }) => {
          return <>
            <Seo {...seo} pathname={seo.pathname || location.pathname} />
            <ScrollProgress />
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
            <ChatComponent />
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
