import { QuickSeo } from "next-quick-seo"
import React from "react"
import Layout from "../components/Layout"
import { NewsletterForm } from "../components/NewsletterForm"
import { NextImage } from "../components/NextImage"
import { SuperLink } from "../components/SuperLink"
export const isLocal = () =>
  typeof window != "undefined" &&
  typeof window.location != "undefined" &&
  window.location?.host?.includes("localhost")

import { getPages } from "../components/utils/getPages"
import { Page } from "../types"


export const getStaticProps = async context => {
  // This crawls all public pages starting from the given root page in order
  // for next.js to pre-generate all pages via static site generation (SSG).
  // This is a useful optimization but not necessary; you could just as easily
  // set paths to an empty array to not pre-generate any pages at build time.
  const pages = getPages()

  return {
    props: {
      pages,
    },
    revalidate: 10,
  }
}

const BlogIndex = ({ pages }: {pages: Page[]}) => {
  console.log('pages: ', pages);
  // const posts = data.allMarkdownRemark.nodes.filter(
  //   node => isLocal() || !node.fields.isDraft
  // )
  const posts = []

  return (
    <Layout>
      <QuickSeo
        title="Home of Lars"
        description="Some kind of weird part of the internet where lars writes stuff. Can be thoughts or articles or anything really."
      />
      <h1 className="text-center hidden font-bold text-gray-900 text-3xl py-12">
        <SuperLink href="/">Lars Karbo</SuperLink>
      </h1>

      <div className="my-36 max-w-sm mx-auto">
        {pages?.map(page => (
          <SuperLink href={page.meta.slug}>
            <div className="flex gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-2 p-1 my-1 transition-colors duration-75">
              {page.meta.icon && (
                <div>{page.meta.icon.value}</div>
              )}
              <div className="font-semibold underline underline-offset-4 decoration-gray-300">{page.meta.title}{
                !page.meta.date && " (draft)"
              }</div>
            </div> 
          </SuperLink>
        ))}
      </div>

      <div className="flex pt-4 pb-24">
        <img
          src="https://s.gravatar.com/avatar/4579b299730ddc53e3d523ec1cd5482a?s=112"
          alt={`Picture of Lars Karbo`}
          className="flex-shrink-0 mr-4 w-14 h-14 rounded-full overflow-hidden"
        />
        <div className="text-2xl font-normal">
          <p className="py-2">I build premium tools for the world.</p>
          <p className="py-2">
            Giving value through <strong>profitable micro-startups</strong> that
            live and breathe in the internet-ecosystem.
          </p>
        </div>
      </div>

      <div className="sm:rounded-2xl mt-12 relative z-10 overflow-hidden sm:border bg-white dark:bg-inherit sm:shadow-2xl border-gray-300 -mx-4 sm:mx-0">
        <NextImage
          width={672}
          height={(1260 / 2400) * 672}
          src="/12s12m.png"
          alt="12 startups in 12 months"
        />
        <div className="p-8 pb-12">
          <h2 className="text-2xl pt-4 font-bold pb-2">
            <SuperLink href={"/12-startups-12-months/"} itemProp="url">
              <span itemProp="headline">
                I'm building 12 startups in 12 months
              </span>
            </SuperLink>
          </h2>
          <p className="py-2 font-light">
            In 2021 I set out on a quest to build a profitable startup every
            month.
          </p>
          <p className="py-2 font-light">
            Read about how it went:{" "}
            <a className="underline font-bold" href="/year-of-making">
              A Year of Making is Done
            </a>
            .
          </p>
          <p className="py-2 font-light">Writings:</p>
          <ul className="list-disc list-inside">
            {posts
              .filter(p => p.fields.date && p.frontmatter.tags?.includes("12x"))
              .map(post => {
                return (
                  <li key={post.fields.slug} className="py-1">
                    <h2 className="pt-4 font-medium inline underline">
                      <SuperLink href={post.fields.slug} itemProp="url">
                        <span itemProp="headline">
                          {post.frontmatter.title}
                        </span>
                      </SuperLink>
                    </h2>
                    {/* <small className="text-gray-700 font-light"> ({post.fields.date})</small> */}
                  </li>
                )
              })}
          </ul>
          <div className="mt-8 mb-4">
            A Norwegian podcast I attended in January 2021:
          </div>
          <div className="rounded-xl overflow-hidden">
            <iframe
              src="https://open.spotify.com/embed/episode/4cFwrDiSekGrSYYZk5mPLD"
              width="100%"
              height="232"
              frameBorder="0"
              className=""
              allowTransparency={true}
              allow="encrypted-media"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="mt-36 mb-12">
        <NewsletterForm />
      </div>

      <p className="py-2 font-light">Other writings:</p>

      <ol style={{ listStyle: `none` }}>
        {posts
          .filter(p => p.fields.date)
          .filter(
            p => !p.frontmatter.tags || !p.frontmatter.tags.includes("12x")
          )
          .map(post => {
            const tags = post.frontmatter.tags || []
            return (
              <li key={post.fields.slug}>
                <article
                  className="post-list-item"
                  itemScope
                  itemType="http://schema.org/Article"
                >
                  <header>
                    <h2 className="text-xl pt-4 font-bold underline">
                      <SuperLink href={post.fields.slug} itemProp="url">
                        <span itemProp="headline">
                          {post.frontmatter.title}
                        </span>
                      </SuperLink>
                    </h2>
                    <small>{post.fields.date}</small>
                  </header>
                  <section>
                    <p itemProp="description" className="font-light">
                      {post.frontmatter.excerpt}
                    </p>
                  </section>
                </article>
              </li>
            )
          })}
      </ol>
    </Layout>
  )
}

export default BlogIndex
