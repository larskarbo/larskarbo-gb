import clsx from "clsx"
import { getPageTitle } from "notion-utils"
import { Collection, CollectionRow, NotionRenderer } from "react-notion-x"
import notionData from "../../content/notionData.json"
import Layout from "../components/Layout"
import { ArticleProvider } from "../components/rendering/article-context"
import { NotionBlockRenderer } from "../components/rendering/NotionBlock"
import { useTheme } from "../components/theme-context"
import { getPages } from "../components/utils/getPages"
import { LinkMap, Page } from "../types"

const isDev = process.env.NODE_ENV === "development" || !process.env.NODE_ENV

export const getStaticProps = async context => {
  const slug = context.params.slug as string
  const page = notionData.pages.find(page => page.meta?.slug === "/" + slug)
  const linkMap = getPages().map(page => ({
    id: page.id,
    slug: page.meta.slug,
  }))

  return {
    props: {
      page,
      slug,
      linkMap
    },
    revalidate: 10,
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  }
}

export default function NotionPage({ page, linkMap }: { page: Page, linkMap: LinkMap }) {
  console.log("page: ", page)
  const recordMap = page?.recordMap
  if (!recordMap) {
    return null
  }

  const title = getPageTitle(recordMap)
  console.log(recordMap.block[page.id].value.content)

  return (
    <Layout>
      <ArticleProvider recordMap={recordMap} linkMap={linkMap}>
        <article
          className={clsx("max-w-2xl mx-auto ")}
        >
          <div className="flex items-center flex-col">
            {page.meta.icon && (
              <div className="w-full dark:hidden">
                <div className="aspect-square overflow-hidden border w-20 bg-white dark:bg-transparent border-black -mb-2 ml-4">
                  <div className="" style={{
                    fontSize: 50
                  }}>{page.meta.icon.value}</div>
                </div>
              </div>
            )}
            <h1
              className={
                "font- text-center font-bold  text-5xl mt-16 mb-32 font-serif text-gray-800 dark:text-gray-200"
              }
            >
              {title}
            </h1>
          </div>
          <div className="prose dark:prose-invert prose-base md:prose-lg">
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
