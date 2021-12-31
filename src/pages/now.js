import { graphql } from "gatsby"
import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

const Now = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Lars Now" description="See what's now and links to connect" />
      <h1 className="text-4xl font-black my-4">Lars Now</h1>
      im not updating this page anymore
      <div style={{ padding: 100 }}></div>
    </Layout>
  )
}

export default Now

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
