import { getPageTitle } from "notion-utils"
import { Collection, CollectionRow, NotionRenderer } from "react-notion-x"
import notionData from "../../content/notionData.json"

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
  console.log(recordMap.block[page.id].value.content)

  return (
    <>
      {/* <Head>
        <meta name='description' content='React Notion X demo renderer.' />
        <title>{title}</title>
      </Head> */}

      <NotionRenderer
        recordMap={recordMap}
        fullPage={true}
        darkMode={false}
        rootDomain="localhost:3000" // used to detect root domain links and open this in the same tab
        components={{
          collection: Collection,
          collectionRow: CollectionRow,
        }}
      />
    </>
  )
}

const OK = () => <div>OK</div>
