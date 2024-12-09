import { Like } from "typeorm";
import db, { WaifuImage, Waifu } from "../../db";
import imageType from "./image_type";
import uNumber from "../functions/number.utils";
import uArray from "../functions/array.utils";

const index = async (page: number | null, name: string | null) => {
  try {
    const waifus = await db.getRepository(WaifuImage).findAndCount({
      where: {
        waifu: {
          name: name ? Like(name) : undefined,
        },
        ImageTypeId: 1,
      },
      order: {
        waifu: {
          franchise: {
            name: "ASC",
          },
          name: "ASC",
        },
      },
      relations: [
        "waifuRarity",
        "imageType",
        "waifu",
        "waifu.franchise",
        "waifu.waifuType",
      ],
      take: 20,
      skip: page ? (page - 1) * 20 : 0,
    });

    return waifus;
  } catch (error) {
    global.logger.error(error);
    throw error;
  }
};

const getOne = async (id: number) => {
  try {
    const waifu = await db.getRepository(Waifu).findOne({
      where: { id },
      relations: [
        "franchise",
        "waifuType",
        "waifuImages",
        "waifuImages.waifuRarity",
        "waifuImages.imageType",
      ],
    });

    return waifu;
  } catch (error) {
    throw error;
  }
};

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

export default { index, getOne, getRandom };
