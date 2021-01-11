import React from "react"
import { Link } from "gatsby"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      null
    )
  } else {
    header = (
      <Link className="font-bold text-xl text-blue-800" to="/">
        Lars Karbo 🌲
      </Link>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:px-0" data-is-root-path={isRootPath}>
      <header className="pt-8 pb-12">{header}</header>
      <main className="">{children}</main>
      <footer className="pt-24 pb-4">
        © {new Date().getFullYear()}, Check me out on twitter: 
        {` `}
        <a href="https://twitter.com/larskarbo">@larskarbo</a>
      </footer>
    </div>
  )
}

export default Layout
