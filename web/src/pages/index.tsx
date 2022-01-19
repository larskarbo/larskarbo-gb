import { QuickSeo } from "next-quick-seo"
import React from "react"
import Layout, { Footer } from "../components/Layout"
import { NewsletterForm } from "../components/NewsletterForm"
import { NextImage } from "../components/NextImage"
import { SuperLink } from "../components/SuperLink"
export const isLocal = () =>
  typeof window != "undefined" &&
  typeof window.location != "undefined" &&
  window.location?.host?.includes("localhost")

import { getPages } from "../components/utils/getPages"
import { Page } from "../types"
import x12pic from "../../public/12s12m.png"
import { isAfter, parse, startOfYear } from "date-fns"
import { groupBy, entries, reverse, sampleSize } from "lodash"
import ReactMarkdown from "react-markdown"

export const getStaticProps = async context => {
  // This crawls all public pages starting from the given root page in order
  // for next.js to pre-generate all pages via static site generation (SSG).
  // This is a useful optimization but not necessary; you could just as easily
  // set paths to an empty array to not pre-generate any pages at build time.
  const pages = getPages()
    .filter(page => page.meta?.date)
    .map(page => ({
      ...page,
      recordMap: null,
    }))

  return {
    props: {
      pages,
    },
    revalidate: 10,
  }
}

const PageLink = ({ page }: { page: Page }) => {
  return (
    <SuperLink href={page.meta.slug} noStyle>
      <div className="flex gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-2 p-1 my-1 transition-colors duration-75">
        {page.meta.icon && <div className="">{page.meta.icon.value}</div>}
        <div className="font-semibold underline underline-offset-4 decoration-gray-300 hover:decoration-gray-400  whitespace-nowrap overflow-ellipsis overflow-hidden">
          {page.meta.title}
          {!page.meta.date && "*"}
        </div>
      </div>
    </SuperLink>
  )
}

const Cat = ({ title, pages }: { title: string; pages: Page[] }) => {
  return (
    <div className="opacity-7f0">
      <h2 className="text-sm text-gray-400 font-medium upperfcase font-mon ">
        {title}
      </h2>
      {pages.map(page => (
        <PageLink key={page.id} page={page} />
      ))}
    </div>
  )
}

const Talk = ({ md }) => {
  return (
    <div className="flex pt-4 pb-24 -left-7 relative max-w-xl mx-auto">
      <img
        src="https://s.gravatar.com/avatar/4579b299730ddc53e3d523ec1cd5482a?s=112"
        alt={`Picture of Lars Karbo`}
        className="flex-shrink-0 mr-4 w-14 h-14 rounded-full overflow-hidden"
      />
      <div className="text-xl font-normal ">
        <ReactMarkdown
          children={md}
          components={{
            p: ({ children }) => <p className="my-2">{children}</p>,
            a: props => <SuperLink {...props} href={props.href} />,
          }}
        />
      </div>
    </div>
  )
}

const BlogIndex = ({ pages }: { pages: Page[] }) => {
  console.log("pages: ", pages)
  // const posts = data.allMarkdownRemark.nodes.filter(
  //   node => isLocal() || !node.fields.isDraft
  // )
  const posts = []

  const articles = pages.filter(page => !page.meta.tags?.includes("scribble"))

  const bestArticles = [
    "year-of-making",
    "12-startups-12-months",
    "bike-4000-km-to-find-myself",
    "internet-mousetrap",
  ]
    .map(slug => articles.find(page => page.meta.slug === slug))
    .filter(Boolean)

  const scribbles = pages.filter(page => page.meta.tags?.includes("scribble"))

  const newPages = pages?.filter(
    page =>
      !page.meta.date ||
      isAfter(
        new Date(page.meta.date),
        parse("2022-01-01", "yyyy-MM-dd", new Date())
      )
  )
  return (
    <>
      <QuickSeo
        title="Home of Lars"
        description="Some kind of weird part of the internet where lars writes stuff. Can be thoughts or articles or anything really."
      />

      <div className="min-h-screen px-8 flex flex-col">
        <div className="w-screen py-24 max-w-6xl mx-auto grid gap-8 grid-cols-2 ">
          <Cat title="Most notable articles" pages={bestArticles} />
          <Cat title="Recent articles" pages={articles.slice(0, 4)} />
        </div>

        <div className="flex flex-grow gap-8  grid-cols-3">
          <div className="w-96">
            <Cat
              title="Things I like"
              pages={newPages.filter(
                page => !page.meta.tags?.includes("scribble")
              )}
            />
          </div>
          <div className="flex flex-grow flex-col items-center">
            <Talk
              md={`
Hi, I'm [Lars](https://larslist.org/).


This website is a place for my thoughts, projects and writings. It is
not centered around one topic, but rather a conglemeration of [my articles](),
[scribbles]() and random ideas.


Like my brain: some good parts, some messy parts, and all in all a
huge interconnected web of interesting topics and creative ideas
            `}
            />
            {/* <div className="flex-grow border-l border-gray-300 mb-8"></div> */}
          </div>
          <div className="w-96">
            <Cat title="Recent scribbles" pages={scribbles} />
          </div>
        </div>
      </div>

      {/* <div className="mt-4 mb-12 max-w-xl mx-auto">
        <NewsletterForm />


        <div className="h-48 border-l border-gray-300 mx-auto w-1"></div>
      </div> */}

      <div className="grid grid-cols-2  items-center">
        <Talk
          md={`
In 2021 I built 12 startups in 12 months.

Giving value through **profitable micro-startups**
that live and breathe in the internet-ecosystem.
            `}
        />

        <div className="max-w-2xl sm:rounded-2xl mt-12 relative z-10 overflow-hidden sm:border bg-white dark:bg-inherit sm:shadow-2xl border-black -mx-4 sm:mx-0">
          <NextImage
            width={672}
            height={(1260 / 2400) * 672}
            src={x12pic}
            placeholder="blur"
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
              <SuperLink href="/year-of-making">
                A Year of Making is Done
              </SuperLink>
              .
            </p>
            {/* <p className="py-2 font-light">Writings about 12x:</p>
              <ul className="list-disc list-inside">
                {pages
                  .filter(p => p.meta.tags?.includes("12x"))
                  .map(page => {
                    return <PageLink key={page.id} page={page} />
                  })}
              </ul> */}
            <div className="mt-8 mb-4 font-light">
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
      </div>

      <div className="max-w-xl mx-auto pt-48">
        <p className="py-2 font-light">Older writings:</p>
        {reverse(
          entries(groupBy(pages, p => new Date(p.meta.date)?.getFullYear()))
        )
          .filter(([year]) => year !== "2022")
          .map(([year, pages]) => (
            <div>
              <p className="py-2 font-light">{year}:</p>
              {pages
                // ?.filter(p => !p.meta.tags?.includes("12x"))
                .filter(p => p.meta.date)
                .map(page => (
                  <PageLink key={page.id} page={page} />
                ))}
            </div>
          ))}
      </div>

      <div className="mx-auto max-w-xl">
        <Footer />
      </div>
    </>
  )
}

export default BlogIndex
