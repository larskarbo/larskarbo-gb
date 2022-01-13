import notionData from "../../../content/notionData.json"
export const getPages = () => {
  const pages = notionData.pages.filter(page => page.meta)
  return pages
}
