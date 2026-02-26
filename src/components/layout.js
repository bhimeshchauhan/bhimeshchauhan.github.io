import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import styled from 'styled-components'
import { siteMeta, personSchema } from '../data/Seo'
import { Helmet } from 'react-helmet'
import favicon from '../assets/images/bhimesh-favicon.svg'
import blueBg from '../assets/images/blue-bg.png'
import { Location } from '@reach/router'

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

const SITE_URL = 'https://bhimeshchauhan.github.io';

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <Location>
        {({ location }) => {
          const canonicalUrl = `${SITE_URL}${location.pathname}`;
          return <>
            <Helmet
              htmlAttributes={{ lang: 'en' }}
              title={data.site.siteMetadata.title}
              meta={[
                { name: 'description', content: siteMeta.description },
                { name: 'keywords', content: siteMeta.keywords.join(", ") },
                { name: 'author', content: siteMeta.author },
                { name: 'copyright', content: siteMeta.copyright },
                // Open Graph
                { property: 'og:title', content: siteMeta.title },
                { property: 'og:description', content: siteMeta.description },
                { property: 'og:image', content: `${SITE_URL}/static/coding-f03226cb34aa24c0946c13b14a648a54.gif` },
                { property: 'og:url', content: canonicalUrl },
                { property: 'og:type', content: 'website' },
                { property: 'og:locale', content: 'en_US' },
                // Twitter Card
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:title', content: siteMeta.title },
                { name: 'twitter:description', content: siteMeta.description },
                { name: 'twitter:image', content: `${SITE_URL}/static/coding-f03226cb34aa24c0946c13b14a648a54.gif` },
              ]}
              link={[
                { rel: 'shortcut icon', type: 'image/png', href: `${favicon}` },
                { rel: 'canonical', href: canonicalUrl },
                { rel: 'alternate', hreflang: 'en', href: canonicalUrl },
              ]}
            >
              <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
            </Helmet>
            <Wrapper className={location.pathname === "/" ? "cutBackground" : ''}>
              <Header />
              {children}
              <Footer footerClass={location.pathname === "/" ? 'footerInitial' : 'footerAbsolute'} />
            </Wrapper>
          </>
        }}
      </Location>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
