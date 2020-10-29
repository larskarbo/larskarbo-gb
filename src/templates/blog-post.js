import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { DiscussionEmbed } from "disqus-react"
import Img from "gatsby-image"



const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const { previous, next } = data

  const disqusConfig = {
    shortname: process.env.GATSBY_DISQUS_NAME,
    config: { identifier: data.site.siteMetadata?.slug, siteTitle },
  }

  const ogImagePath = post.frontmatter.hero?.childImageSharp.fixed.src

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.excerpt || post.excerpt}
        image={ogImagePath}
      />
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          {post.frontmatter.showHeroSign &&
            <>
              <Img
                fluid={post.frontmatter.hero?.childImageSharp.fluid}
                alt="Hero image for the post."
                style={{
                  width: 200,
                  height: "auto",
                  border: "2px solid black",
                  boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.5)"
                }}
              />
              <div style={{
                marginLeft: (200 / 2) - (10 / 2),
                width: 10,
                height: 50,
                border: "2px solid black",
                borderTopWidth: 0,
                backgroundColor: "black",
                // position: "relative",
                // top: -2
              }}></div>
            </>
          }
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <p>{post.frontmatter.date}</p>
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
        <hr />
        <footer>
          <Bio />
        </footer>
        <DiscussionEmbed {...disqusConfig} />
      </article>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        excerpt
        showHeroSign
        hero { 
          childImageSharp {
            fixed(width: 1200, height: 630) {
              src
            }    
            fluid(maxWidth: 200, maxHeight: 105) {
              ...GatsbyImageSharpFluid_withWebp
            }    
          }
        }
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
