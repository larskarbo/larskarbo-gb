import clsx from "clsx"
import { useRouter } from "next/router"
import React from "react"
import { SuperLink } from "./SuperLink"
import { useTheme } from "./theme-context"

const Layout = ({ children }) => {
  const rootPath = `/`
  const isRootPath = useRouter().pathname === rootPath
  let header

  if (isRootPath) {
    header = null
  } else {
    header = (
      <SuperLink
        className={clsx(
          "font-bold text-xl ",
          "dark:text-blue-300 text-blue-800"
        )}
        href="/"
      >
        Lars Karbo 🌲
      </SuperLink>
    )
  }

  return (
    <div className={clsx("w-full d-ark", "dark:bg-gray-900 dark:text-gray-100")}>
      <div className={clsx("w-full max-w-2xl mx-auto px-4 md:px-0")}>
        {header && <header className="pt-8 pb-12">{header}</header>}
        <main className="">{children}</main>
        <footer className="pt-24 pb-4">
          © {new Date().getFullYear()}, Check me out on twitter:
          {` `}
          <a className="underline" href="https://twitter.com/larskarbo">
            @larskarbo
          </a>
          .
        </footer>
      </div>
    </div>
  )
}

export default Layout
