import clsx from "clsx"
import { getPageTitle } from "notion-utils"
import { Collection, CollectionRow, NotionRenderer } from "react-notion-x"
import notionData from "../../content/notionData.json"
import Layout from "../components/Layout"
import { ArticleProvider } from "../components/rendering/article-context"
import { NotionBlockRenderer } from "../components/rendering/NotionBlock"
import { useTheme } from "../components/theme-context"

const isDev = process.env.NODE_ENV === "development" || !process.env.NODE_ENV

export const getStaticProps = async context => {
  const slug = context.params.slug as string
  const page = notionData.pages.find(page => page.meta?.slug === "/" + slug)

  return {
    props: {
      page,
      slug,
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

export default function NotionPage({ page }) {
  console.log("page: ", page)
  const recordMap = page?.recordMap
  if (!recordMap) {
    return null
  }

  const title = getPageTitle(recordMap)
  const { dark } = useTheme()
  console.log(recordMap.block[page.id].value.content)

  return (
    <Layout>
      <ArticleProvider recordMap={recordMap}>
        <article className={clsx("max-w-2xl mx-auto prose prose-lg", dark && "")}>
          <h1 className={"font-  text-4xl my-8"}>{title}</h1>
          {recordMap.block[page.id]?.value.content?.map(contentBlockId => (
            <NotionBlockRenderer
              key={contentBlockId}
              blockId={contentBlockId}
            />
          ))}
        </article>
      </ArticleProvider>
    </Layout>
  )
}

const OK = () => <div>OK</div>
