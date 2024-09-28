import db from "../../db";
import queries from "../queries";

const incorporate = async (
  tgId: Number,
  username: String,
  nickname: String
  // waifuImageId: Number
) => {
  try {
    let user = await queries.user.getOne(tgId);
    if (!user) {
      user = await queries.user.create(tgId, username, nickname, { roleId: 3 });
    }

    if (!user) throw new Error("User not created");
  } catch (error) {
    global.logger.error(error);
    console.error(error);
    throw error;
  }
};

const addWaifuOnList = async (
  userTgId: Number,
  waifuImageId: Number,
  exp: Number
) => {
  const queryRunner = db.createQueryRunner();
  await queryRunner.startTransaction();
  try {
    const user = await queries.user.getOne(userTgId);
    const waifuImage = await queries.waifuImage.getOne(waifuImageId);
    global.logger.info("Estoy en la función para añadir la waifu a la lista");
    console.log(waifuImage);
    console.log(user);
    console.log(exp);

    if (!user) throw new Error("User not found");
    if (!waifuImage) throw new Error("Waifu image not found");

    let newExp = (user.userInfo.exp as number) + (exp as number);
    const levelUp = (newExp as Number) >= user.userInfo.limitExp;
    const newLevel = (user.userInfo.level as number) + (levelUp ? 1 : 0);
    const newLimitExp =
      (user.userInfo.limitExp as number) + (newLevel % 5 === 0 ? 25 : 0);
    const newFavoritePages =
      (user.userInfo.favoritePages as number) +
      (levelUp && newLevel % 4 === 0 ? 1 : 0);
    const newCoins =
      (user.userInfo.coins as number) +
      (waifuImage.waifuRarity.cost as number) * (levelUp ? 1.5 : 1);
    const newDiamonds = (user.userInfo.diamonds as number) + (levelUp ? 1 : 0);
    if (levelUp) newExp -= user.userInfo.limitExp as number;

    await queries.user.updateInfo(queryRunner, user.id, {
      exp: newExp,
      level: newLevel,
      limitExp: newLimitExp,
      favoritePages: newFavoritePages,
      coins: newCoins,
      diamonds: newDiamonds,
    });

    await queryRunner.commitTransaction();

    return {
      levelUp,
      level: newLevel,
      addFavoritePage:
        (newFavoritePages as Number) > user.userInfo.favoritePages,
      favoritePages: newFavoritePages,
    };
  } catch (error) {
    await queryRunner.rollbackTransaction();
    global.logger.error(error);
    console.error(error);
    throw error;
  }
};

export default { incorporate, addWaifuOnList };
