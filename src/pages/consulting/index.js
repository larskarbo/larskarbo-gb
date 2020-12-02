import React from "react"
import { graphql } from "gatsby"
import { Link } from "gatsby"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import './consulting.css'
import sig from "./signature.png"

const Consulting = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <div className="global-wrapper">
      <SEO title="Consulting" description="I provide consulting services" />

      <header className="global-header consulting">
        <h1 className="consulting">Lars Karbo</h1>
        <div className="consulting">
          Consulting overview |
        {" "}<Link className="" to="/">Go to my blog</Link>
        </div>
      </header>
      <main>
        <div className="consulting" style={{ padding: 20, border: "solid 2px black" }}>

          <p className="consulting"><strong>Hi, I’m Lars!</strong></p>

          <p className="consulting">I help companies reach their goals.</p>

          <p className="consulting">For 10 years, I have been building and shipping world-class web solutions.</p>

          <p className="consulting">I’m here to build web and app solutions that fits into your scalable technical infrastructure.  I focus on exeptional user experience, quick iterations and a creative touch.</p>

          <p className="consulting">My philosophies include rapid prototyping, modular components and microservices.</p>

          <p className="consulting">Read more about my work, projects and thoughts in my <Link className="" to="/">tech blog</Link>.</p>

          <button className="consulting" onClick={() => {
            window.location = "mailto:mail@larskarbo.no";
          }}>Work with me</button>
          <p className="rate">What's my rate? $4k USD (35k NOK) per week.</p>

          <img src={sig} style={{
            width: 150 ,
            marginBottom: 0  
          }} />
        </div>
      </main>
    </div>
  )
}


export default Consulting

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
