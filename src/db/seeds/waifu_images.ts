import { QueryRunner } from "typeorm";

import { WaifuImage } from "..";

import waifuImages from "./waifu_images/";

interface IWaifuImages {
  id: number;
  image_type_id: number;
  public_id: string;
  public_url: string;
  waifu_id: number;
  rarity_id: number;
  user_id?: number | null;
  points: number;
  created_at?: string | null;
  updated_at?: string | null;
}

const _formatter = (waifuRarities: IWaifuImages[]) => {
  const waifuImagesFormatted: WaifuImage[] = [];

  waifuRarities.map((i) => {
    const waifuImage = new WaifuImage();
    waifuImage.id = i.id;
    waifuImage.ImageTypeId = i.image_type_id;
    waifuImage.publicId = i.public_id;
    waifuImage.publicUrl = i.public_url;
    waifuImage.waifuId = i.waifu_id;
    waifuImage.rarityId = i.rarity_id;
    waifuImage.userId = i.user_id ?? null;
    waifuImage.points = i.points;
    waifuImage.createdAt = i.created_at ? new Date(i.created_at) : new Date();
    waifuImage.updatedAt = i.updated_at ? new Date(i.updated_at) : new Date();

    waifuImagesFormatted.push(waifuImage);
  });

  return waifuImagesFormatted;
};

const insertWaifuImages = async (queryRunner: QueryRunner) => {
  console.log("insert waifu images");

  waifuImages.forEach(async (waifuImage) => {
    const waifuImagesFormatted = _formatter(waifuImage);
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(WaifuImage)
      .values(waifuImagesFormatted)
      .orUpdate([
        "image_type_id",
        "public_id",
        "public_url",
        "waifu_id",
        "rarity_id",
        "user_id",
        "points",
      ])
      .execute();
  });
};

export default insertWaifuImages;
