import download from "download";
import { pathExists, readJson, writeFile, writeJson } from "fs-extra";
import { entries, sortBy } from "lodash";
import { NotionAPI } from "notion-client";
import { getAllPagesInSpace } from "notion-utils";
import sharp from "sharp";
import { encodeImageToBlurhash, getPageMeta, mapImageUrl } from "./getPageMeta";
import { getPlaiceholder } from "plaiceholder";
import { Page } from "../../web/src/types";
const sortJson = require('sort-json');

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

  const pages: Page[] = [];

  for (const pageId of Object.keys(notionPages)) {
    
    const recordMap = await notion.getPage(pageId, {
      signFileUrls: false
    });
    const { meta } = getPageMeta(pageId, recordMap);
    if(!meta) {
      continue;
    }

    for (const info of entries(recordMap.block)) {
      const [blockId, blockthing] = info;
      const block = blockthing.value;
      if (block.type === "image") {
        const rawsrc = block.properties?.source?.[0]?.[0];
        const filename = rawsrc.split("/").pop();
        const imgsrc = mapImageUrl(rawsrc, block);
        const dir = `../web/public/images/${block.id}/`;
        const imgPath = dir + `${filename}`;
        const extraPath = dir + `extra.json`;

        if (!(await pathExists(imgPath))) {
          console.log("fetching image...")
          await download(imgsrc, dir, {
            filename: filename,
          });
        }

        if (!(await pathExists(extraPath))) {
          // const hash = await encodeImageToBlurhash(imgPath);
          const result = await sharp(imgPath).metadata();
          
          
          await writeJson(extraPath, {
            base64: (await getPlaiceholder("/../"+imgPath)).base64,
            width: result.width,
            height: result.height,
          });
        }

        

        //@ts-ignore
        block.properties.extra = await readJson(extraPath);
      }
    }
    pages.push({
      id: pageId,
      recordMap: recordMap || recordMap,
      meta,
    });
  }


  // we sort to make git diffs better
  const sortedPages = sortBy(sortJson(pages, { depth: 10}), "id")



  await writeFile(
    "../web/content/notionData.json",
    JSON.stringify(
      {
        pages: sortedPages,
      },
      null,
      2
    )
  );
};

fetchAll();
