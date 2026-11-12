require("dotenv").config();

if (!process.env.GATSBY_SUPABASE_URL && process.env.SUPABASE_URL) {
  process.env.GATSBY_SUPABASE_URL = process.env.SUPABASE_URL;
}
if (!process.env.GATSBY_SUPABASE_ANON_KEY && process.env.SUPABASE_ANON_KEY) {
  process.env.GATSBY_SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
}
// backward compat: old .env used SUPABASE_SERVICE_ROLE_KEY for the anon key
if (!process.env.GATSBY_SUPABASE_ANON_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  process.env.GATSBY_SUPABASE_ANON_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
}

module.exports = {
  siteMetadata: {
    title: "Bhimesh Chauhan",
    siteUrl: "https://bhimeshchauhan.com",
  },
  plugins: [
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
        gtagConfig: { anonymize_ip: true },
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
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "Bhimesh Chauhan",
        short_name: "Bhimesh",
        start_url: "/",
        background_color: "#1D1E20",
        theme_color: "#1D1E20",
        display: "standalone",
        icon: "src/assets/images/bhimesh-favicon.svg"
      }
    },
  ],
};
