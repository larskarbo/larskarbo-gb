import clsx from "clsx"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import "../tailwind.css"
import "../styles.css"
import "typeface-montserrat"
import "typeface-merriweather"
import PlausibleProvider from "next-plausible"
// import "react-notion-x/src/styles.css"
import { ThemeProvider } from "../components/theme-context"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <PlausibleProvider domain="larskarbo.no">
        <ThemeProvider>
          <Head>
            <meta name="color-scheme" content="dark light"></meta>
            <meta property="og:site_name" content="Lars Karbo" />
          </Head>
          <Component {...pageProps} />
        </ThemeProvider>
        {/* <div className="bg"></div> */}
      </PlausibleProvider>
    </>
  )
}

export default MyApp
