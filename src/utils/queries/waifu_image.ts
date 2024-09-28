import db, { WaifuImage } from "../../db";

const getOne = async (id: Number) => {
  const waifuImage = await db.getRepository(WaifuImage).findOne({
    where: { id },
    relations: ["waifu", "waifu.waifuType", "waifu.franchise", "waifuRarity"],
  });

  return waifuImage;
};

export default { getOne };
