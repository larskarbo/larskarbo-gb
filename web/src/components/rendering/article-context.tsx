// src/playingNow-context.js
import * as React from "react"

import * as types from "notion-types"

const ArticleContext = React.createContext<{
  recordMap: types.ExtendedRecordMap
}>(undefined)

// const spotifyOriginal = new Spotify()

export function ArticleProvider({ recordMap, children }) {
  return (
    <ArticleContext.Provider value={{ recordMap }}>
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
