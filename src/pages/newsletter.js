import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const Newsletter = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Newsletter" description="Subscribe to my personal newsletter" />
      <h1>Personal newsletter</h1>
      <p>Subscribe to my newsletter and stay in touch with me and my projects. I won't send mails often.</p>
      <NewsletterForm />
      <div style={{ padding: 100 }}></div>
    </Layout>
  )
}

export const NewsletterForm = () => {
  return (
    <form action="https://lesto.larskarbo.no/subscribe" method="POST" accept-charset="utf-8" style={{
      paddingBottom: 20
    }}>
      <label for="name">Name</label><br />
      <input type="text" name="name" id="name" />
      <br />
      <label for="email">Email</label><br />
      <input type="email" name="email" id="email" /><br /><div style={{ display: "none" }}>
        <label for="hp">HP</label><br />
        <input type="text" name="hp" id="hp" />
      </div>
      <br />
      <input type="hidden" name="list" value="Ao892Z12SyDIIjD86DCVLLuA" />
      <input type="hidden" name="subform" value="yes" />
      <input type="submit" name="submit" id="submit" />
    </form>
  )
}

export default Newsletter

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
