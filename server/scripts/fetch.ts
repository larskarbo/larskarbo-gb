import download from "download";
import { pathExists, readJson, writeFile, writeJson } from "fs-extra";
import { entries } from "lodash";
import { NotionAPI } from "notion-client";
import { getAllPagesInSpace } from "notion-utils";
import sharp from "sharp";
import { encodeImageToBlurhash, getPageMeta, mapImageUrl } from "./utils";
import { getPlaiceholder } from "plaiceholder";

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
    console.log("pageId: ", pageId);
    const recordMap = await notion.getPage(pageId);
    const { meta } = getPageMeta(pageId, recordMap);

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
          await download(imgsrc, dir, {
            filename: filename,
          });
        }

        if (true || !(await pathExists(extraPath))) {
          console.log('imgPath: ', imgPath);
          // const hash = await encodeImageToBlurhash(imgPath);
          const result = await sharp(imgPath).metadata();
          
          console.log('result: ', result);
          await writeJson(extraPath, {
            base64: (await getPlaiceholder("/../"+imgPath)).base64,
            width: result.width,
            height: result.height,
          });
        }

        console.log("path: ", imgPath);

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

  await writeFile(
    "../web/content/notionData.json",
    JSON.stringify(
      {
        pages,
      },
      null,
      2
    )
  );
};

fetchAll();
