// src/playingNow-context.js
import * as React from "react"

import * as types from "notion-types"

const ThemeContext = React.createContext<{
  dark: boolean
}>(undefined)

// const spotifyOriginal = new Spotify()

export function ThemeProvider({ children }) {
  const dark = true
  return (
    <ThemeContext.Provider value={{ dark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
