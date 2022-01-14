import notionData from "../../../content/notionData.json"
import { Page } from "../../types"
export const getPages = (): Page[] => {
  const pages = notionData.pages.filter(page => page.meta)
  //@ts-ignore
  return pages
}
