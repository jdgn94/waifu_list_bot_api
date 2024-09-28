import { QueryRunner } from "typeorm";
import db, { User, UserInfo } from "../../db";

interface InfoData {
  level?: number;
  exp?: number;
  coins?: number;
  diamonds?: number;
  goldenTickets?: number;
  favoritePages?: number;
  favoritePagePurchases?: number;
  limitExp?: number;
  loginDaily?: boolean;
}

const getOne = async (tgId: Number) => {
  try {
    const user = await db.getRepository(User).findOne({
      where: { tgId },
      relations: ["role", "userInfo"],
    });
    return user;
  } catch (error) {
    console.error(error);
    global.logger.error(error);
    throw error;
  }
};

const create = async (
  tgId: Number,
  username: String,
  nickname: String,
  { roleId = 3 }
) => {
  const queryRunner = db.createQueryRunner();
  await queryRunner.startTransaction();
  try {
    const totalUsers = await queryRunner.manager
      .createQueryBuilder(User, "user")
      .getCount();
    const user = new User();
    user.tgId = tgId;
    user.username = username;
    user.nickname = nickname;
    user.roleId = totalUsers < 1 ? 1 : roleId;
    await queryRunner.manager.save(user);

    const userInfo = new UserInfo();
    userInfo.userId = user.id;
    await queryRunner.manager.save(userInfo);
    await queryRunner.manager
      .createQueryBuilder()
      .update(User)
      .set({ infoId: userInfo.id })
      .where("tg_id = :tgId", { tgId })
      .execute();

    await queryRunner.commitTransaction();
    return await info(tgId);
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error(error);
    global.logger.error(error);
    throw error;
  }
};

const info = async (tgId: Number) => {
  try {
    const userInfo = await db.getRepository(User).findOne({
      where: { tgId },
      relations: ["role", "userInfo"],
    });

    console.log(userInfo?.franchiseCount);
    console.info(userInfo);
    // const userInfo = await db
    //   .getRepository(User)
    //   .createQueryBuilder("user")
    //   .innerJoinAndMapOne(
    //     "user.userInfo",
    //     UserInfo,
    //     "user_info",
    //     "user.info_id = user_info.id"
    //   )
    //   .innerJoinAndMapOne("user.role", Role, "role", "role.id = user.role_id")
    //   .where("user.tg_id = :tgId", { tgId })
    //   .addSelect("franchiseCount", "franchise_count")
    //   .getOne();
    return userInfo;
  } catch (error) {
    console.error(error);
    global.logger.error(error);
    throw error;
  }
};

const updateInfo = async (
  queryRunner: QueryRunner,
  id: Number,
  data: InfoData
) => {
  try {
    return await queryRunner.manager.update(UserInfo, { userId: id }, data);
  } catch (error) {
    console.error(error);
    global.logger.error(error);
    throw error;
  }
};

export default { getOne, create, info, updateInfo };
