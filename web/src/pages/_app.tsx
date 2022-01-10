import clsx from "clsx"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import "../styles.css"
import "../tailwind.css"
import "typeface-montserrat"
import "typeface-merriweather"
import PlausibleProvider from "next-plausible"
// import "react-notion-x/src/styles.css"
import { ThemeProvider } from "../components/theme-context"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <PlausibleProvider domain="rudeboys.io">
        <ThemeProvider>
          <Head>
            <meta property="og:site_name" content="Rude Boy's" />
          </Head>
          <Component {...pageProps} />
        </ThemeProvider>
        {/* <div className="bg"></div> */}
      </PlausibleProvider>
    </>
  )
}

export default MyApp
