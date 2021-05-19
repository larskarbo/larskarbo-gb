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
      <h2 className="text-2xl font-extrabold my-4 mt-8">Current</h2>
      <ul className="list-disc list-inside">
        <li className="my-4">
          🛠 Founding{" "}
          <a className="underline" href="https://personate.ai/">
            personate.io
          </a>{" "}
          together with{" "}
          <a
            className="underline"
            href="https://www.linkedin.com/in/lars-traaholt-v%C3%A5gnes-432725130/"
          >
            another Lars
          </a>
          .
        </li>
        <li className="my-4">
          👋 Just left the awesome team building{" "}
          <a className="underline" href="https://www.growthday.com/">
            GrowthDay
          </a>
          .
        </li>
      </ul>
      <h2 className="text-2xl font-extrabold my-4 mt-8">Connect with me</h2>
      <ul className="list-disc list-inside">
        <li className="my-4">
          ✉️ My monthly (ish) email newsletter:{" "}
          <a className="underline" href="https://larskarbo.no/newsletter">
            subscribe here
          </a>{" "}
        </li>
        <li className="my-4">
          Twitter:{" "}
          <a className="underline" href="https://twitter.com/larskarbo">
            @larskarbo
          </a>{" "}
        </li>
        <li className="my-4">
          LinkedIn:{" "}
          <a
            className="underline"
            href="https://www.linkedin.com/in/larskarbo/"
          >
            @larskarbo
          </a>{" "}
        </li>
        <li className="my-4">
          Instagram 🔥:{" "}
          <a className="underline" href="https://www.instagram.com/larskarbo/">
            @larskarbo
          </a>{" "}
        </li>
        <li className="my-4">...or come and have a coffee in Oslo 🇳🇴</li>
      </ul>
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
