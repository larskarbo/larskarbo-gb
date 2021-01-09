import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { GatsbyImage } from "gatsby-plugin-image";
import {NewsletterForm} from "../pages/newsletter"



const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const { previous, next } = data


  const ogImagePath = post.frontmatter.hero?.childImageSharp?.gatsbyImageData.src

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
          <h1 className="text-4xl font-black mb-4" itemProp="headline">{post.frontmatter.title}</h1>
          <p className="font-light">{post.frontmatter.date}</p>
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
          className="article"
        />
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>
      <p>Sign up to my personal newsletter:</p>
      <NewsletterForm />
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

export const pageQuery = graphql`query BlogPostBySlug($id: String!, $previousPostId: String, $nextPostId: String) {
  site {
    siteMetadata {
      title
    }
  }
  markdownRemark(id: {eq: $id}) {
    id
    excerpt(pruneLength: 160)
    html
    frontmatter {
      title
      date(formatString: "MMMM DD, YYYY")
      description
      excerpt
      hero {
        childImageSharp {
          gatsbyImageData(width: 1200, height: 630, placeholder: BLURRED, layout: FIXED)
        }
      }
    }
  }
  previous: markdownRemark(id: {eq: $previousPostId}) {
    fields {
      slug
    }
    frontmatter {
      title
    }
  }
  next: markdownRemark(id: {eq: $nextPostId}) {
    fields {
      slug
    }
    frontmatter {
      title
    }
  }
}
`
