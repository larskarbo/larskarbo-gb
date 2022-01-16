import notionData from "../../../content/notionData.json"
import { Page } from "../../types"
import { orderBy } from "lodash"
export const getPages = () => {
  //@ts-ignore
  const pages: Page[] = notionData.pages.filter(page => page.meta)

  return orderBy(pages, p => p.meta.date, "desc")
}
