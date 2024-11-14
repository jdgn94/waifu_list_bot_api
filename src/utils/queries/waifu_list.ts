import { QueryRunner } from "typeorm";
import db, { WaifuList } from "../../db";

interface IGetOne {
  id?: number;
  waifuImageId?: number;
  userId?: number;
}

interface IUpdate {
  userId?: number;
  waifuImageId?: number;
  quantity?: number;
  position?: number;
}

const getOne = async ({ id, waifuImageId, userId }: IGetOne) => {
  if (!(waifuImageId && userId))
    if (!id)
      throw new Error("parameter needed id or waifu image id and user id");
  try {
    const whereQuery = id
      ? { id: id! }
      : { waifuImageId: waifuImageId!, userId: userId! };
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
  userId: number,
  waifuImageId: number
) => {
  try {
    const waifuList = new WaifuList();
    waifuList.userId = userId;
    waifuList.waifuImageId = waifuImageId;
    waifuList.position = null;
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
