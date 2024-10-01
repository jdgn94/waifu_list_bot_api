import { QueryRunner } from "typeorm";

import { SpecialImage } from "..";

import specialImages from "./special_images/";

interface ISpecialImage {
  id: number;
  image_type_id: number;
  public_id: string;
  public_url: string;
  user_id?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

const _formatter = (specialImages: ISpecialImage[]) => {
  const specialImagesFormatted: SpecialImage[] = [];

  specialImages.map((i) => {
    const specialImage = new SpecialImage();
    specialImage.id = i.id;
    specialImage.imageTypeId = i.image_type_id;
    specialImage.publicId = i.public_id;
    specialImage.publicUrl = i.public_url;
    specialImage.userId = i.user_id ?? null;
    specialImage.createdAt = i.created_at ? new Date(i.created_at) : new Date();
    specialImage.updatedAt = i.updated_at ? new Date(i.updated_at) : new Date();

    specialImagesFormatted.push(specialImage);
  });

  return specialImagesFormatted;
};

const insertSpecialImages = async (queryRunner: QueryRunner) => {
  console.log("insert special images");

  specialImages.forEach(async (specialImage) => {
    const specialImagesFormatter = _formatter(specialImage);
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(SpecialImage)
      .values(specialImagesFormatter)
      .orUpdate(["image_type_id", "public_id", "public_url", "user_id"])
      .execute();
  });
};

export default insertSpecialImages;
