import { Like } from "typeorm";
import db, { Franchise } from "../../db";
import { deleteFile, updateFile } from "../../api/utils/cloudinary";

const index = async (name: string | null, page: number) => {
  try {
    console.log("search franchises", name);
    const franchises = await db.getRepository(Franchise).findAndCount({
      where: [
        {
          name: Like(`%${name}%`),
        },
        {
          nickname: Like(`%${name}%`),
        },
      ],
      order: {
        name: "ASC",
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return franchises;
  } catch (error) {
    throw error;
  }
};

const getOne = async (id: number) => {
  try {
    const franchise = await db.getRepository(Franchise).findOne({
      where: { id },
    });
    return franchise;
  } catch (error) {
    throw error;
  }
};

const create = async (
  name: string,
  userId: number,
  nickname?: string,
  webPage?: string,
  image?: Express.Multer.File,
  queryRunner?: any
) => {
  const queryRunnerInternal = queryRunner || db.createQueryRunner();
  if (!queryRunner) await queryRunnerInternal.startTransaction();

  try {
    const franchise = new Franchise();
    franchise.name = name;
    franchise.nickname = nickname ?? null;
    franchise.webPage = webPage ?? null;
    franchise.userId = userId;
    if (image) {
      const imageResponse = await updateFile(image.path, {
        folder: "Waifu List Bot Telegram Franchises",
      });
      if (imageResponse.error) {
        throw imageResponse.error;
      }
      franchise.publicId = imageResponse.public_id;
      franchise.publicUrl = imageResponse.secure_url;
    }
    await db.getRepository(Franchise).save(franchise);
    if (!queryRunner) await queryRunnerInternal.commitTransaction();
    return franchise;
  } catch (error) {
    if (!queryRunner) await queryRunnerInternal.rollbackTransaction();
    throw error;
  }
};

const update = async (
  id: number,
  name: string,
  nickname?: string,
  webPage?: string,
  image?: Express.Multer.File,
  queryRunner?: any
) => {
  const queryRunnerInternal = queryRunner || db.createQueryRunner();
  if (!queryRunner) await queryRunnerInternal.startTransaction();

  try {
    const franchise = await db
      .getRepository(Franchise)
      .findOne({ where: { id } });
    if (!franchise) throw new Error("Franchise not found");
    franchise.name = name;
    franchise.nickname = nickname ?? null;
    franchise.webPage = webPage ?? null;
    if (image) {
      const imageResponse = await updateFile(image.path, {
        folder: "Waifu List Bot Telegram Franchises",
      });
      if (imageResponse.error) {
        throw imageResponse.error;
      }
      if (franchise.publicId) await deleteFile(franchise.publicId);
      franchise.publicId = imageResponse.public_id;
      franchise.publicUrl = imageResponse.secure_url;
    }
    await db.getRepository(Franchise).save(franchise);
    if (!queryRunner) await queryRunnerInternal.commitTransaction();
    return franchise;
  } catch (error) {
    if (!queryRunner) await queryRunnerInternal.rollbackTransaction();
    throw error;
  }
};

export default { index, getOne, create, update };
