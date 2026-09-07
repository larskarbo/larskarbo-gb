import { QuickSeo } from "next-quick-seo"
import React, { useState, useEffect } from "react"
import Layout, { Footer } from "../components/Layout"
import { NewsletterForm } from "../components/NewsletterForm"
import { NextImage } from "../components/NextImage"
import { SuperLink } from "../components/SuperLink"
export const isLocal = () =>
  typeof window != "undefined" &&
  typeof window.location != "undefined" &&
  window.location?.host?.includes("localhost")

import { getPages } from "../components/utils/getPages"
import type { Page } from "../types"
import x12pic from "../../public/12s12m.png"
import { format, isAfter, parse, startOfYear } from "date-fns"
import { groupBy, entries, reverse, sampleSize } from "lodash"
import ReactMarkdown from "react-markdown"
import clsx from "clsx"
import LineDrawing from "../components/LineDrawing"
import { DrawingInstruction } from "../components/DrawingInstruction"
import { MysteryBox } from "../components/MysteryBox"

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

const PageLink = ({
  page,
  includeDate = false,
}: {
  page: Page
  includeDate?: boolean
}) => {
  return (
    <SuperLink href={page.meta.slug} noStyle>
      <div
        className={clsx(
          "flex gap-1  hover:bg-gray-100 dark:hover:bg-gray-800 rounded py-1 md:px-2 transition-colors duration-75",
          includeDate ? "my-1" : "my-1"
        )}
      >
        {page.meta.icon && <div className="">{page.meta.icon.value}</div>}
        <div
          className={clsx(
            "font-semibold underline underline-offset-4 decoration-gray-300 hover:decoration-gray-400",
            false && "  whitespace-nowrap overflow-ellipsis overflow-hidden"
          )}
        >
          {page.meta.title}
          {!page.meta.date && "*"}
          {includeDate && (
            <span className="text-xxs uppercase text-gray-400 font-mono">
              {" "}
              {format(
                page.meta.date ? new Date(page.meta.date) : new Date(),
                "do MMM"
              )}
            </span>
          )}
        </div>
      </div>
    </SuperLink>
  )
}

const Cat = ({
  title,
  pages,
  includeDate = false,
}: {
  title: string
  pages: Page[]
  includeDate?: boolean
}) => {
  return (
    <div className="opacity-7f0">
      <h2 className="text-sm text-gray-400 font-medium upperfcase font-mon ">
        {title}
      </h2>
      {pages.map(page => (
        <PageLink key={page.id} page={page} includeDate={includeDate} />
      ))}
    </div>
  )
}

const Talk = ({ md }) => {
  return (
    <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 gap-y-2 md:flex md:gap-0 md:-left-7 relative max-w-xl mx-auto">
      <img
        src="https://s.gravatar.com/avatar/4579b299730ddc53e3d523ec1cd5482a?s=112"
        alt={`Picture of Lars Karbo`}
        className="flex-shrink-0 md:mr-4 w-14 h-14 rounded-full overflow-hidden"
      />
      <div className="contents md:block text-xl font-normal">
        <ReactMarkdown
          className="contents md:block"
          children={md}
          components={{
            p: ({ children }) => (
              <p className="col-span-2 my-2 first:col-span-1 first:self-center">
                {children}
              </p>
            ),
            a: props => <SuperLink {...props} href={props.href} />,
          }}
        />
      </div>
    </div>
  )
}

const BlogIndex = ({ pages }: { pages: Page[] }) => {
  console.log("pages: ", pages)

  const [linePosition, setLinePosition] = useState<{
    start: { x: number; y: number }
    end: { x: number; y: number }
  } | null>(null)

  const [isManualDrawing, setIsManualDrawing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hasDrawnCircle, setHasDrawnCircle] = useState(false)
  const [hasDrawnSecondCircle, setHasDrawnSecondCircle] = useState(false)

  useEffect(() => {
    const calculateLinePosition = () => {
      if (typeof window !== "undefined") {
        const centerX = window.innerWidth / 2
        const highY = window.innerHeight * 0.15

        setLinePosition({
          start: { x: centerX - 30, y: highY },
          end: { x: centerX + 30, y: highY + 1 },
        })
      }
    }

    const checkMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768) // md breakpoint
      }
    }

    calculateLinePosition()
    checkMobile()

    window.addEventListener("resize", calculateLinePosition)
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", calculateLinePosition)
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // const posts = data.allMarkdownRemark.nodes.filter(
  //   node => isLocal() || !node.fields.isDraft
  // )
  const posts = []

  const articles = pages.filter(page => !page.meta.tags?.includes("scribble"))

  const bestArticles12x = ["year-of-making", "12-startups-12-months"]
    .map(slug => articles.find(page => page.meta.slug === slug))
    .filter(Boolean)

  const bestArticles2022 = ["helication"]
    .map(slug => articles.find(page => page.meta.slug === slug))
    .filter(Boolean)

  const scribbles = pages.filter(page => page.meta.tags?.includes("scribble"))

  const newPages = pages?.filter(
    page =>
      !page.meta.date ||
      isAfter(
        new Date(page.meta.date),
        parse("2026-01-01", "yyyy-MM-dd", new Date())
      )
  )
  return (
    <>
      <QuickSeo
        title="Home of Lars"
        description="Some kind of weird part of the internet where lars writes stuff. Can be thoughts or articles or anything really."
      />

      <MysteryBox isVisible={hasDrawnCircle && !hasDrawnSecondCircle} />

      <div className="min-h-screen pt-12 px-6 md:pt-0 md:px-8 flex flex-col justify-center gap-12 xl:gap-24 relative">
        {linePosition && !isMobile && (
          <>
            <LineDrawing
              initialLine={linePosition}
              onManualDrawingStart={() => setIsManualDrawing(true)}
              onFirstCircle={() => setHasDrawnCircle(true)}
              onSecondCircle={() => setHasDrawnSecondCircle(true)}
            />
            {!isManualDrawing && (
              <DrawingInstruction
                lineStart={linePosition.start}
                lineEnd={linePosition.end}
              />
            )}
          </>
        )}
        <div className="max-w-xl block mx-auto relative z-10">
          <Talk
            md={`
Hi, I'm [Lars](https://larslist.org/).

I build connected physical products, from sketches and circuits to inventions out in the world.

Previously a startup software engineer and neurotech cofounder.

I now run [Karbo Labs](https://www.instagram.com/larskarbo/), a product development studio and hardware media brand with 40M+ views.

            `}
          />
          <div className="mt-12">
            <p className="mb-4 text-sm font-medium text-gray-400">
              Check out my{" "}
              <SuperLink
                href="https://www.turfemon.com/"
                noStyle
                className="underline underline-offset-4 decoration-gray-300 hover:decoration-gray-400"
              >
                dev blog
              </SuperLink>{" "}
              :)
            </p>
            {newPages.length > 0 && (
              <Cat title="Recent posts" pages={newPages} includeDate />
            )}
          </div>
          <div className="hidden md:block pt-12"> </div>
        </div>
      </div>
      {/* <div className="mt-4 mb-12 max-w-xl mx-auto">
        <NewsletterForm />

        <div className="h-48  mx-auto w-1"></div>
      </div> */}

      <section className="max-w-[39rem] md:max-w-xl mx-auto px-6 md:px-0 pt-16 md:pt-24">
        <h2 className="text-sm text-gray-400 font-medium">Elsewhere</h2>
        <div className="mt-3 space-y-4">
          <div>
            <SuperLink href="/nyss.html">
              Han er Hellesylt sin eigen Reodor Felgen
            </SuperLink>
            <p className="mt-1 text-sm text-gray-500">
              A profile about me and Karbo Labs in Nyss, 2026 · Norwegian
            </p>
          </div>
          <div>
            <SuperLink href="https://www.youtube.com/watch?v=I5M2YeG1EII">
              Finding performance bottlenecks with OpenTelemetry
            </SuperLink>
            <p className="mt-1 text-sm text-gray-500">
              My talk at Paris.JS, 2023 · 18 min · French
            </p>
          </div>
          <div>
            <SuperLink href="/kode24.html">
              Sånn skal Lars lage 12 startups på 12 måneder
            </SuperLink>
            <p className="mt-1 text-sm text-gray-500">
              My 12 startups in 12 months project in kode24, 2021 · Norwegian
            </p>
          </div>
          <div>
            <SuperLink href="/tu.html">
              NTNU-studenter hjelper søvnløse til å lære seg å sovne
            </SuperLink>
            <p className="mt-1 text-sm text-gray-500">
              A feature about Drowzee in Teknisk Ukeblad, 2019 · Norwegian
            </p>
          </div>
        </div>
      </section>

      <div className="xl:grid grid-cols-2 flex flex-col items-center px-6 md:px-0 pt-16 md:pt-24">
        <div className="w-full max-w-xl mx-auto">
          <Talk
            md={`
In 2021 I built 12 startups in 12 months.

My mission that year was "Giving value through **profitable micro-startups**
that live and breathe in the internet-ecosystem."
              `}
          />

          <div className="mt-12">
            <Cat title="Notable writings" pages={bestArticles12x} />
          </div>
        </div>

        <div className="w-[calc(100%+3rem)] md:w-full max-w-2xl md:rounded-2xl mt-12 relative z-10 overflow-hidden md:border bg-white dark:bg-black md:shadow-2xl border-black -mx-6 md:mx-0">
          <NextImage
            width={672}
            height={(1260 / 2400) * 672}
            src={x12pic}
            placeholder="blur"
            alt="12 startups in 12 months"
          />
          <div className="max-w-[39rem] md:max-w-none mx-auto p-6 md:p-8 pb-12">
            <h2 className="text-2xl pt-4 font-bold pb-2">
              <SuperLink href={"/12-startups-12-months/"} itemProp="url">
                <span className="font-bold" itemProp="headline ">
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
                allow="encrypted-media"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[39rem] md:max-w-xl mx-auto px-6 md:px-0 pt-16 md:pt-48">
        <p className="py-2 font-light">All writings:</p>
        {reverse(
          entries(groupBy(pages, p => new Date(p.meta.date)?.getFullYear()))
        )
          // .filter(([year]) => year !== "2022")
          .map(([year, pages]) => (
            <div key={year}>
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

      <div className="mx-auto max-w-[39rem] md:max-w-xl px-6 md:px-0">
        <Footer />
      </div>
    </>
  )
}

export default BlogIndex
