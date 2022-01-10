import { useArticle } from "./article-context"
import { Block } from "./Block"

export const NotionBlockRenderer = ({ level = 0, blockId, ...props }) => {
  const { recordMap } = useArticle()
  const id = blockId || Object.keys(recordMap.block)[0]
  const block = recordMap.block[id]?.value

  if (!block) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("missing block", blockId)
    }

    return null
  }

  return (
    <Block
      key={id}
      level={level}
      block={block}
      {...props}
    >
      {block?.content?.map(contentBlockId => (
        <NotionBlockRenderer
          recordMap={recordMap}
          key={contentBlockId}
          blockId={contentBlockId}
          level={level + 1}
          {...props}
        />
      ))}
    </Block>
  )
}
