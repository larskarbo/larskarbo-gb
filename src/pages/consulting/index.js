import React from "react"
import { graphql } from "gatsby"
import { Link } from "gatsby"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import './consulting.css'
import sig from "./signature.png"

import ReactMarkdown from 'react-markdown'

const Consulting = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  const content = `
  I help companies reach their goals.

  For 10 years, I have been building and shipping world-class web solutions.

  I’m here to build web and app solutions that fits into your scalable technical infrastructure.  I focus on exeptional user experience, quick iterations and a creative touch.

  My skills:

  - **React-native apps**: [Drowzee](https://drowzee.com) and SecondBrain
  - **Animations and design**: [Napchart - Sleep schedule planner](https://napchart.com)
  - **Speed dev. & marketing**: Building [12 startups in 12 months](/12-startups-12-months/)
  - **Social media**: Made [viral videos](/larslist-story/) on TikTok
  - **SEO & content**: Writing [my personal blog](/)

  ​ 
  ` 

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

          <p><strong>Hi, I’m Lars!</strong></p>

          <ReactMarkdown children={content} className="consulting" />
          

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
