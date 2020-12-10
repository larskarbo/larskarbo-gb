import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <SEO title="All posts" />
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />
      <div style={{
        padding: 10,
        border: "3px solid black",
        marginBottom: 35,
        marginTop: -15,
      }}>Need a talented developer? Look at my <Link to="/consulting">consulting overview</Link></div>
      <Bio />
      <ol style={{ listStyle: `none` }}>
        {posts.filter(p => p.frontmatter.date).map(post => {
          const title = post.frontmatter.title || post.fields.slug
          const tags = post.frontmatter.tags || []
          return (
            <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  {tags.map(t => <Tag tag={t} />)}
                  <small>{post.frontmatter.date}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.excerpt || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

const tagInfo = {
  "startup-building": {
    name: "startup-building 🚀",
    color: "#e49828"
  }
}

const Tag = ({tag}) => {
  const info = tagInfo[tag] || {
    name: tag,
    color: "gray"
  }
  return (
    <span style={{
      backgroundColor: info.color,
      color: "white",
      padding: 4,
      boxShadow: "rgb(163 163 163) 1px 1px 2px 0px",
      marginRight: 4,
      fontSize: 12.8
    }}>{info.name}</span>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          tags
          excerpt
        }
      }
    }
  }
`
