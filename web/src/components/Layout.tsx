import clsx from "clsx"
import { useRouter } from "next/router"
import React from "react"
import { SuperLink } from "./SuperLink"
import { useTheme } from "./theme-context"

const Layout = ({ children }) => {
  const rootPath = `/`
  const isRootPath = useRouter().pathname === rootPath

  return (
    <div className={clsx("w-full", " ")}>
      <div className={clsx("w-full max-w-2xl mx-auto px-4 md:px-0")}>
        {!isRootPath && (
          <header className="pt-8 pb-12 flex justify-center">
            <SuperLink
              className={clsx(
                "font-bold text-xl ",
                "dark:text-gray-100 text-gray-800"
              )}
              href="/"
            >
              Lars Karbo
            </SuperLink>
          </header>
        )}
        <main className="">{children}</main>
        <Footer />
      </div>
    </div>
  )
}

export default Layout

export const Footer = () => {
  return (
    <footer className="pt-24 pb-4">
      © {new Date().getFullYear()}, Check me out on twitter:
      {` `}
      <a className="underline" href="https://twitter.com/larskarbo">
        @larskarbo
      </a>
      .
    </footer>
  )
}
