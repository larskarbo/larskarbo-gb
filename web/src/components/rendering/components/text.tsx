import { Block, Decoration } from "notion-types"
import { parsePageId } from "notion-utils"
import React from "react"
import { SuperLink } from "../../SuperLink"
import { useArticle } from "../article-context"
import { formatDate, getLink as getSlug } from "../utils"
import { PageTitle } from "./page-title"

export const Text: React.FC<{
  value: Decoration[]
  block: Block
  linkProps?: any
  linkProtocol?: string
  inline?: boolean // TODO: currently unused
}> = ({ value, block, linkProps, linkProtocol }) => {
  const { recordMap, linkMap } = useArticle()

  return (
    <React.Fragment>
      {value?.map(([text, decorations], index) => {
        if (!decorations) {
          if (text === ",") {
            return <span key={index} style={{ padding: "0.5em" }} />
          } else {
            return <React.Fragment key={index}>{text}</React.Fragment>
          }
        }

        const formatted = decorations.reduce((element, decorator) => {
          switch (decorator[0]) {
            case "p": {
              // link to an internal block (within the current workspace)
              const blockId = decorator[1]
              const linkedBlock = recordMap.block[blockId]?.value
              if (!linkedBlock) {
                console.log('"p" missing block', blockId)
                return null
              }

              return (
                <SuperLink className="" href={""}>
                  <PageTitle block={linkedBlock} />
                </SuperLink>
              )
            }

            case "h":
              return <span className={`notion-${decorator[1]}`}>{element}</span>

            case "c":
              return <code className="">{element}</code>

            case "b":
              return <b>{element}</b>

            case "i":
              return <em>{element}</em>

            case "s":
              return <s>{element}</s>

            case "_":
              return <span className="notion-inline-underscore">{element}</span>

            case "m":
              // comment / discussion
              return element //still need to return the base element

            case "a": {
              const v = decorator[1]
              const pathname = v.substr(1)
              const id = parsePageId(pathname, { uuid: true })

              if ((v[0] === "/" || v.includes("rootDomain")) && id) {
                const slug = getSlug(id, linkMap)

                if(!slug) {
                  return element
                }

                return (
                  <SuperLink
                    className="notion-link"
                    href={"/" + slug}
                    {...linkProps}
                  >
                    {element}
                  </SuperLink>
                )
              } else {
                return (
                  <a
                    className="notion-link"
                    href={
                      linkProtocol
                        ? `${linkProtocol}:${decorator[1]}`
                        : decorator[1]
                    }
                    {...linkProps}
                  >
                    {element}
                  </a>
                )
              }
            }

            case "d": {
              const v = decorator[1]
              const type = v?.type

              if (type === "date") {
                // Example: Jul 31, 2010
                const startDate = v.start_date

                return formatDate(startDate)
              } else if (type === "daterange") {
                // Example: Jul 31, 2010 → Jul 31, 2020
                const startDate = v.start_date
                const endDate = v.end_date

                return `${formatDate(startDate)} → ${formatDate(endDate)}`
              } else {
                return element
              }
            }

            default:
              if (process.env.NODE_ENV !== "production") {
                console.log("unsupported text format", decorator)
              }

              return element
          }
        }, <>{text}</>)

        return <React.Fragment key={index}>{formatted}</React.Fragment>
      })}
    </React.Fragment>
  )
}
