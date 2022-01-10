import React from "react"
import { Block } from "notion-types"

import { cs } from "../utils"
import { Text } from "./text"
import { PageIcon } from "./page-icon"
import { useArticle } from "../article-context"

export const PageTitle: React.FC<{
  block: Block
  className?: string
  defaultIcon?: string
}> = ({ block, className, defaultIcon, ...rest }) => {
  
  if (!block) return null

  if (!block.properties?.title) {
    return null
  }

  return (
    <span className={cs("notion-page-title", className)} {...rest}>
      <PageIcon
        block={block}
        defaultIcon={defaultIcon}
        className="notion-page-title-icon"
      />

      <span className="notion-page-title-text">
        <Text
          value={block.properties?.title}
          block={block}
        />
      </span>
    </span>
  )
}
