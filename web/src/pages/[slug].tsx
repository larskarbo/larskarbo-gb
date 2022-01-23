import clsx from "clsx"
import { format } from "date-fns"
import { GetStaticProps } from "next"
import { QuickSeo } from "next-quick-seo"
import Head from "next/head"
import notionData from "../../content/notionData.json"
import Layout from "../components/Layout"
import { ArticleProvider } from "../components/rendering/article-context"
import { NotionBlockRenderer } from "../components/rendering/NotionBlock"
import { getPages } from "../components/utils/getPages"
import { LinkMap, Page } from "../types"

const isDev = process.env.NODE_ENV === "development" || !process.env.NODE_ENV

export const getStaticProps: GetStaticProps = async context => {
  const slug = context.params.slug as string
  const page = notionData.pages.find(page => page.meta?.slug === slug)
  const linkMap = getPages().map(page => ({
    id: page.id,
    slug: page.meta.slug,
  }))

  return {
    notFound: !page,
    props: {
      page,
      slug,
      linkMap,
    },
  }
}

export async function getStaticPaths() {
  return {
    paths: getPages().map(page => ({
      params: { slug: page.meta.slug },
    })),
    fallback: false,
  }
}

export default function NotionPage({
  page,
  linkMap,
}: {
  page: Page
  linkMap: LinkMap
}) {
  const recordMap = page?.recordMap
  if (!recordMap) {
    return null
  }

  console.log("page.meta.date:", page.meta.date)

  const title = page.meta.title

  return (
    <Layout>
      <QuickSeo
        title={title}
        description={page.meta?.description}
        image={
          page.meta?.image &&
          "https://www.larskarbo.no" + page.meta?.image
        }
      />
      <Head>
        <link
          rel="canonical"
          href={`https://www.larskarbo.no/${page.meta.slug}`}
        />
      </Head>
      <ArticleProvider recordMap={recordMap} linkMap={linkMap}>
        <article className={clsx("max-w-2xl mx-auto ")}>
          <div className="flex items-center flex-col">
            {page.meta.icon && (
              <div className="w-full flex justify-center dark:hidden">
                <div className="aspect-square select-none flex justify-center overflow-hidden border w-20 bg-white dark:bg-transparent border-gray-300 rounded -mb-2">
                  <div
                    className=""
                    style={{
                      fontSize: 50,
                    }}
                  >
                    {page.meta.icon.value}
                  </div>
                </div>
              </div>
            )}
            <div className="mb-32">
              <h1
                className={
                  "font- text-center font-bold  text-2xl sm:text-4xl md:text-5xl mt-8  font-serif text-gray-800 dark:text-gray-200"
                }
              >
                {title}
              </h1>
              <div className="text-center mt-4 text-gray-600 dark:text-gray-400">
                by Lars Karbo •{" "}
                {format(
                  page.meta.date ? new Date(page.meta.date) : new Date(),
                  "do MMM yyy"
                )}
              </div>
            </div>
          </div>
          <div className="prose prose-a:not-prose dark:prose-invert prose-base md:prose-lg">
            {recordMap.block[page.id]?.value.content?.map(contentBlockId => (
              <NotionBlockRenderer
                key={contentBlockId}
                blockId={contentBlockId}
              />
            ))}
          </div>
        </article>
      </ArticleProvider>
    </Layout>
  )
}

const OK = () => <div>OK</div>
