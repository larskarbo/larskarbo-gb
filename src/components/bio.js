/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image";

const Bio = () => {
  const data = useStaticQuery(graphql`query BioQuery {
  avatar: file(absolutePath: {regex: "/profile-pic.jpg/"}) {
    childImageSharp {
      gatsbyImageData(width: 50, height: 50, quality: 95, layout: FIXED)
    }
  }
  site {
    siteMetadata {
      author {
        name
        summary
      }
      social {
        twitter
      }
    }
  }
}
`)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  // const social = data.site.siteMetadata?.social

  const avatar = data?.avatar?.childImageSharp?.gatsbyImageData
  console.log("🚀 ~ data", data)
  console.log("🚀 ~ avatar", avatar)

  return (
    <div className="flex pt-16 pb-24">
        <div className="flex-shrink-0 mr-4 rounded-full overflow-hidden">
          <GatsbyImage
            image={avatar}
            alt={author?.name || ``}
            className="rounded-full overflow-hidden"
            />
        </div>
      <p>
        Written by <strong>{author.name}</strong> - {author?.summary || null}
      </p>
    </div>
  );
}

export default Bio
