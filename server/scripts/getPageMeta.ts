import { encode } from "blurhash";
import type { Block, ExtendedRecordMap } from "notion-types";
import { getDateValue, getPageTitle } from "notion-utils";
import sharp from "sharp";
import type { Meta } from "../../web/src/types";
import { formatISO, parse } from "date-fns";

export const getPageMeta = (pageId, recordMap: ExtendedRecordMap) => {
  const mainBlock = recordMap.block[pageId];
  const toggleBlockId = mainBlock.value.content.find((bId) => {
    return recordMap.block[bId].value.type === "toggle";
  });
  console.log("toggleBlockId: ", toggleBlockId);

  if (!toggleBlockId) {
    return {};
  }

  const toggleBlock = recordMap.block[toggleBlockId];

  const date = getDateValue(
    toggleBlock.value.properties?.title?.[0][1]
  )?.start_date;

  // if (!date || date.length !== 10) {
  //   return {};
  // }

  //@ts-ignore
  const icon = mainBlock.value.format?.page_icon;
  console.log("icon: ", pageId, icon);

  // Add defensive check for content
  if (!toggleBlock.value.content || !Array.isArray(toggleBlock.value.content)) {
    console.log(
      "Warning: toggleBlock.value.content is undefined or not an array"
    );
    console.log(
      "toggleBlock.value structure:",
      JSON.stringify(toggleBlock.value, null, 2)
    );
    return {};
  }

  const imageBlock = getBlock(
    toggleBlock.value.content.find((bId) => {
      return getBlock(bId, recordMap).value.type === "image";
    }),
    recordMap
  );
  console.log("toggleBlock.value.content: ", toggleBlock.value.content);
  const restOfText = toggleBlock.value.content
    .map((bId) => getBlock(bId, recordMap))
    .filter((block) => block.value.type === "text")
    .filter((block) => block.value.properties?.title)
    .map((block) => block.value.properties.title[0][0]);
  const slug = restOfText.find((t) => t.startsWith("/"))?.replace("/", "");
  const tags = restOfText
    .find((t: string) => t.startsWith("Tags: "))
    ?.replace("Tags: ", "")
    .split(",");
  const description = restOfText.length > 1 ? restOfText[0] : undefined;

  const meta: Meta = {
    image: imageBlock
      ? `/images/${imageBlock.value.id}/${imageBlock.value.format.display_source
          .split("/")
          .pop()}`
      : undefined,
    slug,
    tags: tags || [],
    description,
    icon: icon ? { type: "emoji", value: icon } : undefined,
    date: date ? formatISO(parse(date, "yyyy-MM-dd", new Date())) : undefined,
    title: getPageTitle(recordMap),
  };
  console.log("meta: ", meta);
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

export const mapImageUrl = (url: string, block: Block) => {
  if (!url) {
    return null;
  }

  if (url.startsWith("data:")) {
    return url;
  }

  let processedUrl = url;

  if (processedUrl.startsWith("/images")) {
    processedUrl = `https://www.notion.so${processedUrl}`;
  }

  // more recent versions of notion don't proxy unsplash images
  if (!processedUrl.startsWith("https://images.unsplash.com")) {
    processedUrl = `https://www.notion.so${
      processedUrl.startsWith("/image")
        ? processedUrl
        : `/image/${encodeURIComponent(processedUrl)}`
    }`;

    const notionImageUrlV2 = new URL(processedUrl);
    let table = block.parent_table === "space" ? "block" : block.parent_table;
    if (table === "collection") {
      table = "block";
    }
    notionImageUrlV2.searchParams.set("table", table);
    notionImageUrlV2.searchParams.set("id", block.id);
    notionImageUrlV2.searchParams.set("cache", "v2");

    processedUrl = notionImageUrlV2.toString();
  }

  return processedUrl;
};

export const encodeImageToBlurhash = (path) =>
  new Promise((resolve, reject) => {
    sharp(path)
      .raw()
      .ensureAlpha()
      .resize(32, 32, { fit: "inside" })
      .toBuffer((err, buffer, obj) => {
        const { width, height } = obj;
        if (err) return reject(err);
        resolve(encode(new Uint8ClampedArray(buffer), width, height, 4, 4));
      });
  });
