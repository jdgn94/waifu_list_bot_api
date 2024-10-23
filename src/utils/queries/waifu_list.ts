import { QueryRunner } from "typeorm";
import db, { WaifuList } from "../../db";

interface IGetOne {
  id?: Number;
  waifuImageId?: Number;
  userId?: Number;
}

interface IUpdate {
  userId?: Number;
  waifuImageId?: Number;
  quantity?: Number;
  position?: Number;
}

const getOne = async ({ id, waifuImageId, userId }: IGetOne) => {
  if (!id || !(waifuImageId && userId))
    throw new Error("parameter needed id or waifu image id and user id");

  try {
    const whereQuery = id ? { id: id! } : {};
    const waifuList = await db.getRepository(WaifuList).findOne({
      where: whereQuery,
    });

    return waifuList;
  } catch (error) {
    global.logger.error(error);
    console.error(error);
    throw error;
  }
};

const create = async (
  queryRunner: QueryRunner,
  userId: Number,
  waifuImageId: Number
) => {
  try {
    const waifuImagePosition = await db.getRepository(WaifuList).count({
      where: {
        userId,
      },
    });

    const waifuList = new WaifuList();
    waifuList.userId = userId;
    waifuList.waifuImageId = waifuImageId;
    waifuList.position = waifuImagePosition + 1;
    await queryRunner.manager.save(waifuList);

    return waifuList;
  } catch (error) {
    console.error(error);
    global.logger.error(error);
    throw error;
  }
};

const update = async (
  queryRunner: QueryRunner,
  id: Number,
  { userId, waifuImageId, quantity, position }: IUpdate
) => {
  try {
    await queryRunner.manager.update(
      WaifuList,
      { id },
      { userId, waifuImageId, quantity, position }
    );
    return;
  } catch (error) {
    console.log(error);
    global.logger.error(error);
    throw error;
  }
};

export default { getOne, create, update };
