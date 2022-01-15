import { Block, BlockMap } from "notion-types"
import isUrl from "is-url-superb"
import { format } from "date-fns"
import { RecordMap, ExtendedRecordMap } from "notion-types"
import { LinkMap } from "../../types"

export const cs = (...classes: Array<string | undefined | false>) =>
  classes.filter(a => !!a).join(" ")

export { isUrl }

export const getLink = (blockId: string, linkMap: LinkMap) => {
  console.log('linkMap: ', linkMap);
  console.log('blockId: ', blockId);
  return linkMap.find(link => link.id === blockId)?.slug
}


const groupBlockContent = (blockMap: BlockMap): string[][] => {
  const output: string[][] = []

  let lastType: string | undefined = undefined
  let index = -1

  Object.keys(blockMap).forEach(id => {
    const blockValue = blockMap[id]?.value

    if (blockValue) {
      blockValue.content?.forEach(blockId => {
        const blockType = blockMap[blockId]?.value?.type

        if (blockType && blockType !== lastType) {
          index++
          lastType = blockType
          output[index] = []
        }

        if (index > -1) {
          output[index].push(blockId)
        }
      })
    }

    lastType = undefined
  })

  return output
}

export const getListNumber = (blockId: string, blockMap: BlockMap) => {
  const groups = groupBlockContent(blockMap)
  const group = groups.find(g => g.includes(blockId))

  if (!group) {
    return
  }

  return group.indexOf(blockId) + 1
}

export const getBlockSource = (block: Block) => {
  const rawsrc = block.properties?.source?.[0]?.[0]

  if (block.type == "image") {
    const url = `/images/${block.id}/${rawsrc.split("/").pop()}`
    console.log('url: ', url);
    return url
  }
  return rawsrc
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

export const formatDate = (input: string) => {
  const date = new Date(input)
  const month = date.getMonth()
  return `${months[month]} ${date.getDate()}, ${date.getFullYear()}`
}

export const isBrowser = typeof window !== "undefined"

export function getCollectionGroups(
  collection: any,
  collectionView: any,
  collectionData: any,
  ...rest
) {
  const elems = collectionView?.format?.collection_groups || []
  return elems?.map(({ property, hidden, value: { value, type } }) => {
    const isUncategorizedValue = typeof value === "undefined"
    const isDateValue = value?.range
    // TODO: review dates reducers
    const queryLabel = isUncategorizedValue
      ? "uncategorized"
      : isDateValue
      ? value.range?.start_date || value.range?.end_date
      : value?.value || value

    const collectionGroup = collectionData[`results:${type}:${queryLabel}`]
    let queryValue =
      !isUncategorizedValue && (isDateValue || value?.value || value)
    let schema = collection.schema[property]

    // Checkbox boolen value must be Yes||No
    if (type === "checkbox" && value) {
      queryValue = "Yes"
    }

    if (isDateValue) {
      schema = {
        type: "text",
        name: "text",
      }

      // TODO: review dates format based on value.type ('week'|'month'|'year')
      queryValue = format(new Date(queryLabel), "MMM d, YYY hh:mm aa")
    }

    return {
      collectionGroup,
      schema,
      value: queryValue || "No description",
      hidden,
      collection,
      collectionView,
      collectionData,
      blockIds: collectionGroup?.blockIds,
      ...rest,
    }
  })
}
