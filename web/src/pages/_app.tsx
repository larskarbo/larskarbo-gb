import clsx from "clsx"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import "../styles.css"
import "../tailwind.css"
import "typeface-montserrat"
import "typeface-merriweather"
import PlausibleProvider from "next-plausible";
import 'react-notion-x/src/styles.css'



function MyApp({ Component, pageProps }) {
  return (
    <>
      <PlausibleProvider domain="rudeboys.io">
        <Head>
          <meta property="og:site_name" content="Rude Boy's" />
        </Head>
        <div
          className="flex relative flex-col items-center mfain  pt-0  min-h-screen"
          style={{}}
        >
          <div className=" w-full ">
            <div className="px-8 md:px-0 ">
              <Component {...pageProps} />
            </div>
            <div className="pb-24"></div>
            {/* <Footer /> */}
          </div>
        </div>

        {/* <div className="bg"></div> */}
      </PlausibleProvider>
    </>
  )
}

export default MyApp
