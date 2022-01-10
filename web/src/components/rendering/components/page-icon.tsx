import React from "react"
import { getBlockIcon, getBlockTitle } from "notion-utils"
import { Block, PageBlock, CalloutBlock } from "notion-types"

import { cs, isUrl } from "../utils"

const isIconBlock = (value: Block): value is PageBlock | CalloutBlock => {
  return (
    value.type === "page" ||
    value.type === "callout" ||
    value.type === "collection_view" ||
    value.type === "collection_view_page"
  )
}

export const PageIcon: React.FC<{
  block: Block
  className?: string
  hideDefaultIcon?: boolean
  defaultIcon?: string
  recordMap?: any
}> = ({
  block,
  className,
  recordMap,
  hideDefaultIcon = false,
  defaultIcon,
}) => {
  if (!isIconBlock(block)) {
    return null
  }

  const icon = getBlockIcon(block, recordMap) ?? defaultIcon
  const title = getBlockTitle(block, recordMap)

  if (icon && isUrl(icon)) {
    return null
    // const url = defaultMapImageUrl(icon, block)

    // return (
    //   <img
    //     className={cs(className, "notion-page-icon")}
    //     src={url}
    //     alt={title ? title : "Icon"}
    //     loading="lazy"
    //   />
    // )
  } else {
    const iconValue = icon?.trim()

    if (!iconValue) {
      if (hideDefaultIcon) {
        return null
      }

      return null
    //    (
    //     <DefaultPageIcon
    //       className={cs(className, "notion-page-icon")}
    //       alt={title ? title : "Page"}
    //     />
    //   )
    }

    return (
      <span
        className={cs(className, "notion-page-icon")}
        role="img"
        aria-label={icon}
      >
        {iconValue}
      </span>
    )
  }
}
