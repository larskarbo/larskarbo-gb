/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */
//@ts-nocheck
import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
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
      social {
        twitter
      }
    }
  }
}
`)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  // const social = data.site.siteMetadata?.social

  const avatar = data?.avatar?.childImageSharp?.gatsbyImageData


  return (
    <div className="flex pt-16 pb-24">
            <GatsbyImage
              image={avatar}
              alt={`Lars Karbo`}
              className="flex-shrink-0 mr-4 rounded-full overflow-hidden"
              />
      <p>
        Written by <strong>Lars Karbo</strong> - An indie hacker currently working his way through his <Link className="underline text-blue-800" to="/12-startups-12-months/">12 startups in 12 months</Link> project. Sharing insights from the journey.
      </p>
    </div>
  );
}

export default Bio
