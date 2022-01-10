import { encode } from "blurhash";
import { Block, ExtendedRecordMap } from "notion-types";
import { getDateValue, getPageTitle } from "notion-utils";
import sharp from "sharp";

export const getPageMeta = (pageId, recordMap: ExtendedRecordMap) => {
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

export const mapImageUrl = (url: string, block: Block) => {
  if (!url) {
    return null;
  }

  if (url.startsWith("data:")) {
    return url;
  }

  if (url.startsWith("/images")) {
    url = `https://www.notion.so${url}`;
  }

  // more recent versions of notion don't proxy unsplash images
  if (!url.startsWith("https://images.unsplash.com")) {
    url = `https://www.notion.so${
      url.startsWith("/image") ? url : `/image/${encodeURIComponent(url)}`
    }`;

    const notionImageUrlV2 = new URL(url);
    let table = block.parent_table === "space" ? "block" : block.parent_table;
    if (table === "collection") {
      table = "block";
    }
    notionImageUrlV2.searchParams.set("table", table);
    notionImageUrlV2.searchParams.set("id", block.id);
    notionImageUrlV2.searchParams.set("cache", "v2");

    url = notionImageUrlV2.toString();
  }

  return url;
};

export const encodeImageToBlurhash = (path) =>
  new Promise((resolve, reject) => {
    sharp(path)
      .raw()
      .ensureAlpha()
      .resize(32, 32, { fit: "inside" })
      .toBuffer((err, buffer, obj) => {
          console.log('obj: ', obj);
          const { width, height } = obj
        if (err) return reject(err);
        resolve(encode(new Uint8ClampedArray(buffer), width, height, 4, 4));
      });
  });
