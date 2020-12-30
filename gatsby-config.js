require("dotenv").config({
  path: `.env`,
})

module.exports = {
  siteMetadata: {
    title: `Lars Karbo 🌲`,
    author: {
      name: `Lars Karbo`,
      summary: `- An indie hacker currently working his way through his 12 startups in 12 months project. Sharing insights from the journey.`,
    },
    description: `Lars Karbo's personal blog. I write about bootstrapping, coding and building small businesses.`,
    siteUrl: `https://larskarbo.no`,
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
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-embed-video",
            options: {
              width: 800,
              ratio: 1.77, // Optional: Defaults to 16/9 = 1.77
              height: 400, // Optional: Overrides optional.ratio
              related: false, //Optional: Will remove related videos from the end of an embedded YouTube video.
              noIframeBorder: true, //Optional: Disable insertion of <style> border: 0
              urlOverrides: [
                {
                  id: 'youtube',
                  embedURL: (videoId) => `https://www.youtube-nocookie.com/embed/${videoId}`,
                }
              ], //Optional: Override URL of a service provider, e.g to enable youtube-nocookie support
              containerClass: 'embedVideo-container', //Optional: Custom CSS class for iframe container, for multiple classes separate them by space
            }
          },
          {
            resolve: `gatsby-remark-images-plus`,
            options: {
              // Options here
              withWebp: true,
              maxWidth: 630,
              tracedSVG: true
            }
          },
          // {
          //   resolve: `gatsby-remark-images`,
          //   options: {
          //     maxWidth: 630,
          //     tracedSVG: true
          //   },
          // },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
          "@weknow/gatsby-remark-twitter",
          `gatsby-plugin-postcss`
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Lars Karbo`,
        short_name: `Lars Karbo`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/profile-pic.jpg`,
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        exclude: [`/projects/`, `/consulting/`],
      }
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://larskarbo.no`,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
