import React from "react"
import { graphql } from "gatsby"

import SEO from "../../components/seo"

import Layout from '../../components/layout';

const projects = [
  {
    title: "Drowzee",
    time: "2019-2020",
    description: "Medical Neurotechnology for treating insomnia. Took a product from idea to clinical trial.",
    link: "https://ahughes.biz/videos/rapgod-ai-secondbrain-techstars-music-accelerator/",
    status: "left"
  },
  {
    title: "SecondBrain - RapGod",
    time: "2018",
    description: "Worked in SecondBrain LA",
    link: "https://ahughes.biz/videos/rapgod-ai-secondbrain-techstars-music-accelerator/",
    status: "inactive"
  },
  {
    title: "Slapper",
    time: "2020",
    description: "Organize and annotate Spotify and Youtube samples.",
    longDescription:`A web app that organizes songs and snippets from music services. Lets you annotate, collaborate and share your collection.

    The app is written in React and Expo, and uses serverless functions, Netlify and FaunaDB to provide a seamless modern experience.`,
    link: "https://slapper.io",
    status: "active"
  },
  {
    title: "FocusMonkey",
    time: "2020",
    description: "Smart productivity timer that connects to the Spotify API",
    longDescription:`A smart productivity timer that gives you music as reward. This web-app connects to the Spotify API and let's you choose which playlist to play while working and which one to activate after a given amount of time.

    FocusMonkey was launched on ProductHunt in 2020, and is still active. `,
    link: "https://focusmonkey.io",
    status: "active"
  },
  {
    title: "Mrfylke Auto Login",
    time: "2015-2016",
    description: "Chrome extension that logged me automatically into the high school wifi",
    link: "https://chrome.google.com/webstore/detail/mrfylke-auto-login/goikmhebfehhdkmaogkjfeaiijienmgo?hl=en",
    status: "inactive"
  },
  {
    title: "Napchart",
    time: "2014-present",
    description: "Polyphasic sleep calculator used by hundreds of sleep hackers every day.",
    longDescription: `A visual time planner used for polyphasic sleep experimenting. The site is a web-app built with React and Firebase and hosted on Netlify. The core part of the app is a HTML5 Canvas with custom graphics, interactivity and animation.
    Napchart is still used as the primary tool for sleep hackers, and recently hit 120.000 saved charts.`,
    link: "https://napchart.com",
    status: "active"
  },
  {
    title: "WonderAbout.info",
    time: "2012",
    description: "A website answering scientifically curious questions.",
    status: "inactive"
  },
  {
    title: "The Fake Virus",
    time: "2010-2013",
    description: "Collection of fake prank viruses for computers",
    status: "inactive"
  }
]

const statusToClass = {
  "inactive": "bg-gray-100 text-gray-800",
  active: "bg-green-100 text-green-800",
  "left": "bg-blue-100 text-blue-800"
}

const Consulting = ({ data, location }) => {
  // require('./projects.css')
  return (

    <Layout location={location}>
      <SEO title="Consulting" description="I provide consulting services" />
      <header>
        <h1 className="text-3xl font-bold">List of projects</h1>
      </header>
      <main>
        <p>I'd like to show a list of my failures. Let this serve as a reminder to everyone on the outside that it takes a long time, and many tries to succeed.</p>
        <p>These are projects I have done throughout the years.</p>

        <div className="bg-white shadow overflow-hidden sm:rounded-md mt-8">

          <ul>
            {projects.map(p =>
              <li key={p.title} className=" border-t border-gray-200 p-4
           hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out m-0">
                <div className="flex flex-row">

                  <div className="w-20 text-xs flex-shrink-0">
                    {p.time}

                  </div>
                  <div className="mr-2">
                    <span className="inline-flex items-center justify-center h-8 w-8  bg-gray-200 mt-1">
                      {/* <img src= */}
                    </span>
                  </div>
                  <div className="flex flex-grow flex-col">
                    <div className="font-bold ">{p.title}
                    </div>
                    <div className="text-sm">{p.description}
                    </div>

                  </div>
                  <div>
                    <span className={"px-2 inline-flex text-xs leading-5 font-semibold rounded-full " + statusToClass[p.status]}>
                      {p.status}
                    </span>

                  </div>
                </div>
              </li>
            )}

          </ul>
        </div>
      </main>
    </Layout>
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
