import React from "react"

import { QuickSeo } from "next-quick-seo"
import Layout from "../components/Layout"

const NotFoundPage = ({}) => {
  return (
    <Layout>
      <QuickSeo title="404: Not Found" />
      <h1>404: Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Layout>
  )
}

export default NotFoundPage
