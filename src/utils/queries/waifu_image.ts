import { UploadApiOptions } from "cloudinary";
import { QueryRunner } from "typeorm";

import db, { WaifuImage } from "../../db";
import { updateFile, deleteFile } from "../../api/utils/cloudinary";

const getOne = async (id: number) => {
  const waifuImage = await db.getRepository(WaifuImage).findOne({
    where: { id },
    relations: ["waifu", "waifu.waifuType", "waifu.franchise", "waifuRarity"],
  });

  return waifuImage;
};

const create = async (
  waifuId: number,
  imageTypeId: number,
  rarityId: number,
  points: number,
  userId: number,
  file: Express.Multer.File,
  options?: UploadApiOptions,
  queryRunner?: QueryRunner
) => {
  const queryRunnerInternal = queryRunner ?? db.createQueryRunner();
  if (!queryRunner) await queryRunnerInternal.startTransaction();
  try {
    const newImage = new WaifuImage();
    const imageResponse = await updateFile(file.path, options);

    if (imageResponse.error) {
      throw imageResponse.error;
    }
    newImage.publicId = imageResponse.public_id;
    newImage.publicUrl = imageResponse.secure_url;
    newImage.waifuId = waifuId;
    newImage.imageTypeId = imageTypeId;
    newImage.rarityId = rarityId;
    newImage.points = points;
    newImage.userId = userId;
    await queryRunnerInternal.manager.save(newImage);
  } catch (error) {}
};

const update = async (
  id: number,
  imageTypeId: number,
  rarityId: number,
  points: number,
  file?: Express.Multer.File,
  options?: UploadApiOptions,
  queryRunner?: QueryRunner
) => {
  const queryRunnerInternal = queryRunner ?? db.createQueryRunner();
  if (!queryRunner) await queryRunnerInternal.startTransaction();
  try {
    const image = await queryRunnerInternal.manager
      .getRepository(WaifuImage)
      .findOne({ where: { id } });
    if (!image) throw new Error("Image not found");
    if (file) {
      const imageResponse = await updateFile(file.path, options);
      if (imageResponse.error) {
        throw imageResponse.error;
      }
      if (image.publicId) await deleteFile(image.publicId);
      image.publicId = imageResponse.public_id;
      image.publicUrl = imageResponse.secure_url;
    }
    image.imageTypeId = imageTypeId;
    image.rarityId = rarityId;
    image.points = points;
    await queryRunnerInternal.manager.save(image);
  } catch (error) {
    if (!queryRunner) await queryRunnerInternal.rollbackTransaction();
    throw error;
  }
};

export default { getOne, create, update };
