import React from "react"
import throttle from "lodash.throttle"
import {
  getBlockIcon,
  getBlockTitle,
  getTextContent,
  getPageTableOfContents,
  getBlockParentPage,
  uuidToId,
} from "notion-utils"
import * as types from "notion-types"
import TweetEmbed from "react-tweet-embed"

// import { PageIcon } from './components/page-icon'
// import { PageTitle } from './components/page-title'
// import { LinkIcon } from './icons/link-icon'
// import { cs, getListNumber, isUrl } from './utils'
import { Text } from "./components/text"
import isUrl from "is-url-superb"
import clsx from "clsx"
import { getBlockSource, getListNumber } from "./utils"
import { useArticle } from "./article-context"
import { NextImage } from "../NextImage"
// import { SyncPointerBlock } from './components/sync-pointer-block'
// import { AssetWrapper } from './components/asset-wrapper'

const tocIndentLevelCache: {
  [blockId: string]: number
} = {}

export const Block: React.FC<{
  block: types.Block
  level: number

  className?: string
  bodyClassName?: string

  header?: React.ElementType
  footer?: React.ReactNode
  pageHeader?: React.ReactNode
  pageFooter?: React.ReactNode
  pageAside?: React.ReactNode
  pageCover?: React.ReactNode

  hideBlockId?: boolean
  disableHeader?: boolean
}> = props => {
  const { block, children } = props

  const { recordMap } = useArticle()
  if (!block) {
    return null
  }

  switch (block.type) {
    case "header":
    // fallthrough
    case "sub_header":
    // fallthrough
    case "sub_sub_header": {
      if (!block.properties) return null

      const blockColor = block.format?.block_color
      const id = uuidToId(block.id)
      const title =
        getTextContent(block.properties.title) || `Notion Header ${id}`

      // we use a cache here because constructing the ToC is non-trivial
      let indentLevel = tocIndentLevelCache[block.id]
      let indentLevelClass: string

      if (indentLevel === undefined) {
        const page = getBlockParentPage(block, recordMap)

        if (page) {
          const toc = getPageTableOfContents(page, recordMap)
          const tocItem = toc.find(tocItem => tocItem.id === block.id)

          if (tocItem) {
            indentLevel = tocItem.indentLevel
            tocIndentLevelCache[block.id] = indentLevel
          }
        }
      }

      if (indentLevel !== undefined) {
        indentLevelClass = `notion-h-indent-${indentLevel}`
      }

      const isH1 = block.type === "header"
      const isH2 = block.type === "sub_header"
      const isH3 = block.type === "sub_sub_header"

      const classNameStr = clsx(
        isH1 && "notion-h notion-h1",
        isH2 && "notion-h notion-h2 dark:text-orange-300",
        isH3 && "notion-h notion-h3",
        blockColor && `notion-${blockColor}`,
        indentLevelClass
      )

      const innerHeader = (
        <span>
          <div id={id} className="notion-header-anchor" />

          <a className="notion-hash-link" href={`#${id}`} title={title}>
            {/* <LinkIcon /> */}
          </a>

          <span className="notion-h-title">
            <Text value={block.properties.title} block={block} />
          </span>
        </span>
      )

      //page title takes the h1 so all header blocks are greater
      if (isH1) {
        return (
          <h2 className={classNameStr} data-id={id}>
            {innerHeader}
          </h2>
        )
      } else if (isH2) {
        return (
          <h3 className={classNameStr} data-id={id}>
            {innerHeader}
          </h3>
        )
      } else {
        return (
          <h4 className={classNameStr} data-id={id}>
            {innerHeader}
          </h4>
        )
      }
    }

    case "divider":
      return <hr className={clsx("notion-hr")} />

    case "text":
      if (!block.properties && !block.content?.length) {
        return <div className={clsx("notion-blank")}>&nbsp;</div>
      }

      const blockColor = block.format?.block_color

      return (
        <p className={clsx(blockColor && `notion-${blockColor}`)}>
          {block.properties?.title && (
            <Text value={block.properties.title} block={block} />
          )}

          {children && <div className="notion-text-children">{children}</div>}
        </p>
      )

    case "bulleted_list":
    // fallthrough
    case "numbered_list":
      const wrapList = (content: React.ReactNode, start?: number) =>
        block.type === "bulleted_list" ? (
          <ul className={clsx("notion-list", "notion-list-disc")}>{content}</ul>
        ) : (
          <ol
            start={start}
            className={clsx("notion-list", "notion-list-numbered")}
          >
            {content}
          </ol>
        )

      let output: JSX.Element | null = null

      if (block.content) {
        output = (
          <>
            {block.properties && (
              <li>
                <Text value={block.properties.title} block={block} />
              </li>
            )}
            {wrapList(children)}
          </>
        )
      } else {
        output = block.properties ? (
          <li>
            <Text value={block.properties.title} block={block} />
          </li>
        ) : null
      }

      const isTopLevel =
        block.type !== recordMap.block[block.parent_id]?.value?.type
      const start = getListNumber(block.id, recordMap.block)

      return isTopLevel ? wrapList(output, start) : output

    case "tweet":
      console.log("block:", block)
      return (
        <div className="flex justify-center w-full">
          <TweetEmbed id={block.properties.source[0][0].split("/").pop()} />
        </div>
      )
    case "maps":
    // fallthrough
    case "pdf":
    // fallthrough
    case "figma":
    // fallthrough
    case "typeform":
    // fallthrough
    case "codepen":
    // fallthrough
    case "excalidraw":
    // fallthrough
    case "image":
      // fallthrough
      const source = getBlockSource(block)

      console.log("block.properties: ", block.properties)
      const caption = block.properties?.caption
      // @ts-ignore
      const extra = block.properties.extra
      const aspect = extra.width / extra.height

      return (
        <figure className="  ">
          <div className="w-full flex justify-center dark:brightness-90 hover:dark:brightness-100 filter">
            <NextImage
              src={source}
              blurDataURL={extra.base64}
              placeholder="blur"
              width={672}
              height={672 / aspect}
            />
          </div>
          {caption && (
            <figcaption className="">
              <Text value={caption} block={block} />
            </figcaption>
          )}
        </figure>
      )
    case "gist":
    // fallthrough
    // return null

    case "quote": {
      if (!block.properties) return null
      //@ts-ignore
      const blockColor = block.format?.block_color

      return (
        <blockquote
          className={clsx("notion-quote", blockColor && `notion-${blockColor}`)}
        >
          {/* @ts-ignore */}
          <Text value={block.properties.title} block={block} />
        </blockquote>
      )
    }

    case "callout":
      return (
        <div
          className={clsx(
            "notion-callout",
            block.format?.block_color &&
              `notion-${block.format?.block_color}_co`
          )}
        >
          {/* <PageIcon block={block} /> */}

          <div className="notion-callout-text">
            <Text value={block.properties?.title} block={block} />
            {children}
          </div>
        </div>
      )

    case "toggle":
      return (
        <details className={clsx("notion-toggle")}>
          <summary>
            <Text value={block.properties?.title} block={block} />
          </summary>

          <div>{children}</div>
        </details>
      )

    case "to_do":
      const isChecked = block.properties?.checked?.[0]?.[0] === "Yes"

      return (
        <div className={clsx("notion-to-do")}>
          <div className="notion-to-do-item">
            {/* <components.checkbox blockId={blockId} isChecked={isChecked} /> */}

            <div
              className={clsx(
                "notion-to-do-body",
                isChecked && `notion-to-do-checked`
              )}
            >
              <Text value={block.properties?.title} block={block} />
            </div>
          </div>

          <div className="notion-to-do-children">{children}</div>
        </div>
      )

    default:
      if (process.env.NODE_ENV !== "production") {
        console.log(
          "Unsupported type " + (block as any).type,
          JSON.stringify(block, null, 2)
        )
      }

      return <div />
  }

  return null
}
