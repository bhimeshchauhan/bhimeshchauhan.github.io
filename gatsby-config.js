module.exports = {
  siteMetadata: {
    title: "Bhimesh Chauhan",
    siteUrl: "http://bhimeshchauhan.github.io",
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-styled-components",
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `Signika`,
          `source sans pro\:300,400,600`, // you can also specify font weights and styles
        ],
      },
    },
    {
      resolve: `gatsby-transformer-sharp`,
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [
          "G-MXN2LDQ2MB", // Google Analytics / GA
        ],
        pluginConfig: {
          head: true,
          anonymize_ip: true,
        },
      },
    },
  ],
};
