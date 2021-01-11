import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { StaticImage, getImage } from "gatsby-plugin-image"
import { NewsletterForm } from './newsletter';

const BlogIndex = ({ data, location }) => {
  const posts = data.allMarkdownRemark.nodes
  console.log('posts: ', posts);

  return (
    <Layout location={location} title={"Lars Karbo"}>
      <SEO title="My personal blog" />
      <h1 className="text-center font-bold text-gray-900 text-3xl py-12">
        <Link to="/">Lars Karbo</Link>
      </h1>

      <div className="flex pt-4 pb-24">
        <StaticImage
          width={50}
          height={50}
          src="../../content/assets/profile-pic.jpg"
          alt={`Picture of Lars Karbo`}
          className="flex-shrink-0 mr-4 rounded-full overflow-hidden"
        />
        <div>
          <p className="py-1">
            Hi! I am Lars. My goal is to create something that will <strong>change the world</strong>.
          </p>
          <p className="py-1">
            I will do it step by step.
          </p>
          <p className="py-1">
            First step is to create 12 startups and learn the tools of the 21st century.
          </p>
        </div>
      </div>



      <div className="sm:rounded-2xl overflow-hidden sm:border sm:shadow-2xl border-gray-300 -mx-4 sm:mx-0">
        <StaticImage
          layout="fluid"
          maxWidth={672} src="./12s12m.png" alt="12 startups in 12 months" />
        <div className="p-8 pb-12">

          <h2 className="text-2xl pt-4 font-bold pb-2">
            <Link to={"/12-startups-12-months/"} itemProp="url">
              <span itemProp="headline">I'm building 12 startups in 12 months</span>
            </Link>
          </h2>
          <p className="py-2 font-light">Starting november 2020 I set out on a quest to build a profitable startup every month.</p>
          <p className="py-2 font-light">Startups:</p>
          <ul className="list-disc list-inside">
            <li className="py-1">
              <h2 className="pt-4 font-medium inline">
                <Link to={"https://FileParty.co"} itemProp="url" className="underline">
                  FileParty.co 
                </Link>
                <span> - (December)</span>
              </h2>
            </li>
            <li className="py-1">
              <h2 className="pt-4 font-medium inline">
                <Link to={"https://slapper.io"} itemProp="url" className="underline">
                  Slapper.io 
                </Link>
                <span> - (November)</span>
              </h2>
            </li>
          </ul>
          <p className="py-2 font-light">Writings:</p>
          <ul className="list-disc list-inside">
            {posts.filter(p => p.frontmatter.date && p.frontmatter.tags?.includes("12x")).map(post => {
              return (
                <li key={post.fields.slug} className="py-1">
                  <h2 className="pt-4 font-medium inline underline">
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{post.frontmatter.title}</span>
                    </Link>
                  </h2>
                  {/* <small className="text-gray-700 font-light"> ({post.frontmatter.date})</small> */}
                </li>
              )
            })}
          </ul>
        </div>
      </div>



      <div className="mt-36 mb-12">
        <p>Get notified of my next launch:</p>
        <NewsletterForm />
      </div>

      <p className="py-2 font-light">Other writings:</p>

      <ol style={{ listStyle: `none` }}>
        {posts
          .filter(p => p.frontmatter.date)
          .filter(p => !p.frontmatter.tags || !p.frontmatter.tags.includes("12x"))
          .map(post => {
            const imageData = getImage(post.frontmatter.hero)
            const tags = post.frontmatter.tags || []
            return (
              <li key={post.fields.slug}>
                <article
                  className="post-list-item"
                  itemScope
                  itemType="http://schema.org/Article"
                >
                  {/* <GatsbyImage className="w-52" image={imageData} /> */}
                  <header>
                    <h2 className="text-xl pt-4 font-bold underline">
                      <Link to={post.fields.slug} itemProp="url">
                        <span itemProp="headline">{post.frontmatter.title}</span>
                      </Link>
                    </h2>
                    <small>{post.frontmatter.date}</small>
                  </header>
                  <section>
                    <p
                      itemProp="description"
                      className="font-light"
                    >{post.frontmatter.excerpt}</p>
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

const Tag = ({ tag }) => {
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
          hero {
            childImageSharp {
              gatsbyImageData(maxWidth: 720, layout: FLUID)
            }
          }
        }
      }
    }
  }
`
