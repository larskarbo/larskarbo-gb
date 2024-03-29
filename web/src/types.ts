import { ExtendedRecordMap } from "notion-types"

export type Page = {
  id: string
  meta?: Meta
  recordMap: ExtendedRecordMap
}

export type Meta = {
  image?: string
  description?: string
  date?: Date | string
  icon?: {
    type: "emoji" | "url"
    value: string
  }
  slug: string
  tags: string[]
  title: string
}

export type LinkMap = { id: string; slug: string }[]
