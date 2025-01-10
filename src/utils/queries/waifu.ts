import { Like, QueryRunner } from "typeorm";
import db, { WaifuImage, Waifu } from "../../db";
import imageType from "./image_type";
import uNumber from "../functions/number.utils";
import uArray from "../functions/array.utils";

const index = async (
  page: number | null,
  name: string | null,
  franchiseId: number | null
) => {
  try {
    console.log("search waifus");
    console.log("params: ", page, name, franchiseId);
    const waifus = await db.getRepository(WaifuImage).findAndCount({
      where: [
        {
          waifu: {
            name: name ? Like(`%${name}%`) : undefined,
            franchiseId: franchiseId ? franchiseId : undefined,
          },
          imageTypeId: 1,
        },
        {
          waifu: {
            nickname: name ? Like(`%${name}%`) : undefined,
            franchiseId: franchiseId ? franchiseId : undefined,
          },
          imageTypeId: 1,
        },
      ],
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
      imageTypeId: category.id,
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

const create = async (
  name: string,
  nickname: string | null,
  age: number,
  franchiseId: number,
  typeId: number,
  userId: number,
  queryRunner?: QueryRunner
) => {
  const queryRunnerInternal = queryRunner ?? db.createQueryRunner();
  if (!queryRunner) await queryRunnerInternal.startTransaction();
  try {
    const waifu = new Waifu();
    waifu.name = name;
    waifu.nickname = nickname;
    waifu.age = age;
    waifu.franchiseId = franchiseId;
    waifu.typeId = typeId;
    waifu.userId = userId;
    await queryRunnerInternal.manager.save(waifu);

    if (!queryRunner) await queryRunnerInternal.commitTransaction();
    return waifu;
  } catch (error) {
    if (!queryRunner) await queryRunnerInternal.rollbackTransaction();
    throw error;
  }
};

const update = async (
  id: number,
  name: string,
  nickname: string | null,
  age: number,
  franchiseId: number,
  typeId: number,
  userId: number,
  queryRunner?: QueryRunner
) => {
  const queryRunnerInternal = queryRunner ?? db.createQueryRunner();
  if (!queryRunner) await queryRunnerInternal.startTransaction();
  try {
    const waifu = await queryRunnerInternal.manager
      .getRepository(Waifu)
      .findOne({ where: { id } });
    console.log(waifu);
    if (!waifu) throw new Error("Waifu not found");

    waifu.name = name;
    waifu.nickname = nickname;
    waifu.age = age;
    waifu.franchiseId = franchiseId;
    waifu.typeId = typeId;
    waifu.userId = userId;
    await queryRunnerInternal.manager.save(waifu);

    if (!queryRunner) await queryRunnerInternal.commitTransaction();
    console.log(waifu);
    return waifu;
  } catch (error) {
    if (!queryRunner) await queryRunnerInternal.rollbackTransaction();
    throw error;
  }
};

export default { index, getOne, getRandom, create, update };
