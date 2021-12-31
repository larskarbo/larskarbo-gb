import { graphql, Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { NewsletterForm } from "./newsletter"

export const isLocal = () =>
  typeof window != "undefined" &&
  typeof window.location != "undefined" &&
  window.location?.host?.includes("localhost")

const BlogIndex = ({ data, location }) => {
  const posts = data.allMarkdownRemark.nodes.filter(
    node => isLocal() || !node.fields.isDraft
  )

  return (
    <Layout location={location} title={"Lars Karbo"}>
      <SEO title="Home of Lars" />
      <h1 className="text-center font-bold text-gray-900 text-3xl py-12">
        <Link to="/">Lars Karbo</Link>
      </h1>

      <div className="flex pt-4 pb-24">
        <img
          src="https://s.gravatar.com/avatar/4579b299730ddc53e3d523ec1cd5482a?s=112"
          alt={`Picture of Lars Karbo`}
          className="flex-shrink-0 mr-4 w-14 h-14 rounded-full overflow-hidden"
        />
        <div className="text-2xl font-normal">
          <p className="py-2">I build premium tools for the world.</p>
          <p className="py-2">
            Giving value through <strong>profitable micro-startups</strong> that
            live and breathe in the internet-ecosystem.
          </p>
        </div>
      </div>

      <div className="sm:rounded-2xl mt-12 relative z-10 overflow-hidden sm:border bg-white sm:shadow-2xl border-gray-300 -mx-4 sm:mx-0">
        <StaticImage
          layout="constrained"
          width={672}
          src="./12s12m.png"
          alt="12 startups in 12 months"
        />
        <div className="p-8 pb-12">
          <h2 className="text-2xl pt-4 font-bold pb-2">
            <Link to={"/12-startups-12-months/"} itemProp="url">
              <span itemProp="headline">
                I'm building 12 startups in 12 months
              </span>
            </Link>
          </h2>
          <p className="py-2 font-light">
            In 2021 I set out on a quest to build a profitable startup every
            month.
          </p>
          <p className="py-2 font-light">
            Read about how it went:{" "}
            <a className="underline font-bold" href="/year-of-making">
              A Year of Making is Done
            </a>
            .
          </p>
          <p className="py-2 font-light">Writings:</p>
          <ul className="list-disc list-inside">
            {posts
              .filter(p => p.fields.date && p.frontmatter.tags?.includes("12x"))
              .map(post => {
                return (
                  <li key={post.fields.slug} className="py-1">
                    <h2 className="pt-4 font-medium inline underline">
                      <Link to={post.fields.slug} itemProp="url">
                        <span itemProp="headline">
                          {post.frontmatter.title}
                        </span>
                      </Link>
                    </h2>
                    {/* <small className="text-gray-700 font-light"> ({post.fields.date})</small> */}
                  </li>
                )
              })}
          </ul>
          <div className="mt-8 mb-4">
            A Norwegian podcast I attended in January 2021:
          </div>
          <iframe
            src="https://open.spotify.com/embed/episode/4cFwrDiSekGrSYYZk5mPLD"
            width="100%"
            height="232"
            frameBorder="0"
            allowtransparency="true"
            allow="encrypted-media"
          ></iframe>
        </div>
      </div>

      <div className="mt-36 mb-12">
        <NewsletterForm />
      </div>

      <p className="py-2 font-light">Other writings:</p>

      <ol style={{ listStyle: `none` }}>
        {posts
          .filter(p => p.fields.date)
          .filter(
            p => !p.frontmatter.tags || !p.frontmatter.tags.includes("12x")
          )
          .map(post => {
            const tags = post.frontmatter.tags || []
            return (
              <li key={post.fields.slug}>
                <article
                  className="post-list-item"
                  itemScope
                  itemType="http://schema.org/Article"
                >
                  <header>
                    <h2 className="text-xl pt-4 font-bold underline">
                      <Link to={post.fields.slug} itemProp="url">
                        <span itemProp="headline">
                          {post.frontmatter.title}
                        </span>
                      </Link>
                    </h2>
                    <small>{post.fields.date}</small>
                  </header>
                  <section>
                    <p itemProp="description" className="font-light">
                      {post.frontmatter.excerpt}
                    </p>
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
    color: "#e49828",
  },
}

const Tag = ({ tag }) => {
  const info = tagInfo[tag] || {
    name: tag,
    color: "gray",
  }
  return (
    <span
      style={{
        backgroundColor: info.color,
        color: "white",
        padding: 4,
        boxShadow: "rgb(163 163 163) 1px 1px 2px 0px",
        marginRight: 4,
        fontSize: 12.8,
      }}
    >
      {info.name}
    </span>
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
    allMarkdownRemark(sort: { fields: [fields___date], order: DESC }) {
      nodes {
        excerpt
        fields {
          slug
          date(formatString: "MMMM DD, YYYY")
          isDraft
        }
        frontmatter {
          title
          description
          tags
          excerpt
          hero {
            childImageSharp {
              gatsbyImageData(width: 1200, height: 627, layout: FIXED)
            }
          }
        }
      }
    }
  }
`
