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
    <form action="https://lesto.larskarbo.no/subscribe" className="py-4 pb-12" method="POST" acceptCharset="utf-8" style={{
    }}>
      <label htmlFor="name" className="block text-sm font-medium leading-5 text-gray-700">Name</label>
      <input type="text" name="name" id="name" className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out
              border border-gray-300 rounded-md appearance-none focus:outline-none
              focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5" />
      <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">Email</label>
      <input
        id="email"
        type="email"
        tabIndex="1"
        name="email"
        placeholder="you@domain.com"
        required=""
        className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out
              border border-gray-300 rounded-md appearance-none focus:outline-none
              focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
      />
      <div style={{ display: "none" }}>
        <label htmlFor="hp">HP</label>
        <input type="text" name="hp" id="hp" />
      </div>

      <input type="hidden" name="list" value="Ao892Z12SyDIIjD86DCVLLuA" />
      <input type="hidden" name="subform" value="yes" />
      <input type="submit" name="submit" id="submit" className="mt-2 shadow-sm w-full flex justify-center cursor-pointer py-2 px-4 border
              border-transparent text-sm font-medium rounded-md text-gray-900
               focus:outline-none focus:border-gray-700 focus:shadow-outline-indigo active:bg-gray-700 transition duration-150 ease-in-out" />
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
