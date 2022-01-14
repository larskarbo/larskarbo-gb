// src/playingNow-context.js
import * as React from "react"

import * as types from "notion-types"
import { LinkMap } from "../../types"

const ArticleContext = React.createContext<{
  recordMap: types.ExtendedRecordMap,
  linkMap: LinkMap
}>(undefined)

// const spotifyOriginal = new Spotify()

export function ArticleProvider({ recordMap, linkMap, children }) {
  return (
    <ArticleContext.Provider value={{ recordMap, linkMap }}>
      {children}
    </ArticleContext.Provider>
  )
}

export function useArticle() {
  const context = React.useContext(ArticleContext)
  if (context === undefined) {
    throw new Error("useArticle must be used within a ArticleProvider")
  }
  return context
}
