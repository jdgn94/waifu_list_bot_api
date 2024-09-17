import db, { WaifuImage } from "../../db";
import imageType from "./image_type";
import uNumber from "../functions/number.utils";
import uArray from "../functions/array.utils";

const getRandom = async () => {
  const category = await imageType.getRandom();

  const waifuImages = await db.getRepository(WaifuImage).find({
    where: {
      ImageTypeId: category.id,
    },
  });

  if (waifuImages.length == 0) return await getRandom();

  const waifuImageShuffle = uArray.shuffle(waifuImages);
  const waifuImage =
    waifuImageShuffle[uNumber.getRandom(0, waifuImages.length - 1)];
  const waifu = await db.getRepository(WaifuImage).findOne({
    where: {
      id: waifuImage.waifuId,
    },
    relations: [
      "waifuRarity",
      "imageType",
      "waifu",
      "waifu.franchise",
      "waifu.waifuType",
    ],
  });

  if (!waifu) return await getRandom();

  return waifu;
};

export default { getRandom };
