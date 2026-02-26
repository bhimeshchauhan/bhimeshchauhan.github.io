module.exports = {
  siteMetadata: {
    title: "Bhimesh Chauhan",
    siteUrl: "https://bhimeshchauhan.github.io",
  },
  plugins: [
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/`,
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          "G-MXN2LDQ2MB", // Google Analytics / GA
        ],
        // This object is used for configuration specific to this plugin
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          head: true,
        },
      },
    },
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-styled-components",
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`,
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `Signika`,
          `source sans pro\:300,400,600`,
          `Montserrat`,
          `Inter\:700`,
          `Maven+Pro`,
        ],
        display: 'swap',
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Bhimesh Chauhan — Engineering Leader & AI Specialist`,
        short_name: `Bhimesh`,
        start_url: `/`,
        background_color: `#1d1e20`,
        theme_color: `#7fa1e8`,
        display: `standalone`,
        icon: `src/assets/images/bhimesh-favicon.svg`,
      },
    },
  ],
};
