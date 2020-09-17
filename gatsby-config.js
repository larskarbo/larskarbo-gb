module.exports = {
  siteMetadata: {
    title: `Lars Karbo`,
    name: `Lars Karbo`,
    siteUrl: `https://larskarbo.no`,
    description: `This is my description that will be used in the meta tags and important for search results`,
    hero: {
      heading: `👋 Hi! Welcome! You won't regret checking out my website.`,
      maxWidth: 652,
    },
    social: [
      {
        name: `twitter`,
        url: `https://twitter.com/larskarbo`,
      },
      {
        name: `github`,
        url: `https://github.com/larskarbo`,
      },
      {
        name: `linkedin`,
        url: `https://www.linkedin.com/in/larskarbo`,
      },
    ],
  },
  plugins: [
    {
      resolve: "@narative/gatsby-theme-novela",
      options: {
        contentPosts: "content/posts",
        contentAuthors: "content/authors",
        basePath: "/",
        authorsPage: true,
        sources: {
          local: true,
          // contentful: true,
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Novela by Narative`,
        short_name: `Novela`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#fff`,
        display: `standalone`,
        icon: `src/assets/favicon.png`,
      },
    },
    {
      resolve: `gatsby-plugin-netlify-cms`,
      options: {
      },
    },
      {
        resolve: `gatsby-plugin-google-analytics`,
        options: {
          trackingId: "UA-178281633-1",
        },
      },
  ],
};
