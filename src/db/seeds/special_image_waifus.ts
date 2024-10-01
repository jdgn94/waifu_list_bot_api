import { QueryRunner } from "typeorm";

import { SpecialImageWaifu } from "..";

import specialImageWaifus from "./special_image_waifus/";

interface ISpecialImage {
  id: number;
  special_image_id: number;
  waifu_image_id: number;
  user_id?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

const _formatter = (specialImages: ISpecialImage[]) => {
  const specialImageWaifusFormatted: SpecialImageWaifu[] = [];

  specialImages.map((i) => {
    const specialImageWaifu = new SpecialImageWaifu();
    specialImageWaifu.id = i.id;
    specialImageWaifu.specialImageId = i.special_image_id;
    specialImageWaifu.waifuImageId = i.waifu_image_id;
    specialImageWaifu.userId = i.user_id ?? null;
    specialImageWaifu.createdAt = i.created_at
      ? new Date(i.created_at)
      : new Date();
    specialImageWaifu.updatedAt = i.updated_at
      ? new Date(i.updated_at)
      : new Date();

    specialImageWaifusFormatted.push(specialImageWaifu);
  });

  return specialImageWaifusFormatted;
};

const insertSpecialImageWaifus = async (queryRunner: QueryRunner) => {
  console.log("insert special image waifus");

  specialImageWaifus.forEach(async (specialImageWaifu) => {
    const specialImageWaifusFormatter = _formatter(specialImageWaifu);
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(SpecialImageWaifu)
      .values(specialImageWaifusFormatter)
      .orUpdate(["special_image_id", "waifu_image_id", "user_id"])
      .execute();
  });
};

export default insertSpecialImageWaifus;
