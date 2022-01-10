import {
  getPageTitle,
  getAllPagesInSpace,
  getBlockTitle,
  getDateValue,
  getBlockIcon,
} from "notion-utils";
import { NotionAPI } from "notion-client";
import { Collection, CollectionRow, NotionRenderer } from "react-notion-x";
import { writeJson } from "fs-extra";

const notion = new NotionAPI();

const fetchAll = async () => {
  const rootNotionPageId = "fd68700ff66742999c0e41a4d5bc7c4a";
  const rootNotionSpaceId = "5257cf0b-8124-4419-87b6-815988437df5";

  // This crawls all public pages starting from the given root page in order
  // for next.js to pre-generate all pages via static site generation (SSG).
  // This is a useful optimization but not necessary; you could just as easily
  // set paths to an empty array to not pre-generate any pages at build time.
  const notionPages = await getAllPagesInSpace(
    rootNotionPageId,
    rootNotionSpaceId,
    notion.getPage.bind(notion),
    {
      traverseCollections: false,
    }
  );

  const paths = Object.keys(notionPages).map((pageId) => `/${pageId}`);

  const pages = [];

  for (const pageId of Object.keys(notionPages)) {
    if (pageId != "8711af9b-3254-48b8-9b35-f8d6be011914") {
      continue;
    }
    const recordMap = await notion.getPage(pageId);
    const { meta, recordMapCleaned } = getPageMeta(pageId, recordMap);
    pages.push({
      id: pageId,
      recordMap: recordMapCleaned || recordMap,
      meta,
    });
  }

  await writeJson("../web/content/notionData.json", {
    pages,
  });
};

const getPageMeta = (pageId, recordMap) => {
  const mainBlock = recordMap.block[pageId];
  const toggleBlockId = mainBlock.value.content.find((bId) => {
    return recordMap.block[bId].value.type === "toggle";
  });

  if (!toggleBlockId) {
    return {};
  }

  const toggleBlock = recordMap.block[toggleBlockId];
  const date = getDateValue(
    toggleBlock.value.properties.title[0][1]
  )?.start_date;

  if (!date || date.length !== 10) {
    return {};
  }

  const imageBlock = getBlock(
    toggleBlock.value.content.find((bId) => {
      return getBlock(bId, recordMap).value.type === "image";
    }),
    recordMap
  );
  const restOfText = toggleBlock.value.content
    .filter((bId) => {
      return getBlock(bId, recordMap).value.type === "text";
    })
    .map((id) => getBlock(id, recordMap).value.properties.title[0][0]);
  const slug = restOfText.find((t) => t.startsWith("/"));
  const tags = restOfText
    .find((t: string) => t.startsWith("Tags: "))
    .replace("Tags: ", "")
    .split(",");
  const description = restOfText[0];
  const meta = {
    image: imageBlock.value.format.display_source,
    slug,
    tags,
    description,
    date,
    title: getPageTitle(recordMap),
  };
  mainBlock.value.content = mainBlock.value.content.filter(
    (bId) => bId !== toggleBlockId
  );

  return {
    meta,
    recordMapCleaned: recordMap,
  };
};

const getBlock = (blockId, recordMap) => {
  const block = recordMap.block[blockId];
  return block;
};

fetchAll();
