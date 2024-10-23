import { QueryRunner } from "typeorm";

import queries from "../queries";

const _extraCoins = (waifuInMaxLevel: Boolean, levelUp: Boolean) => {
  if (waifuInMaxLevel && levelUp) return 2.5;
  if (waifuInMaxLevel) return 2;
  if (levelUp) return 1.5;
  return 1;
};

const _extraDiamonds = (waifuInMaxLevel: Boolean, levelUp: Boolean) => {
  if (waifuInMaxLevel && levelUp) return 3;
  if (waifuInMaxLevel) return 2;
  if (levelUp) return 1;
  return 0;
};

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
  queryRunner: QueryRunner,
  userTgId: Number,
  waifuImageId: Number,
  exp: Number
) => {
  try {
    const user = await queries.user.getOne(userTgId);
    const waifuImage = await queries.waifuImage.getOne(waifuImageId);
    global.logger.info("Estoy en la función para añadir la waifu a la lista");
    console.log(waifuImage);
    console.log(user);
    console.log(exp);

    if (!user) throw new Error("User not found");
    if (!waifuImage) throw new Error("Waifu image not found");
    let waifuInMaxLevel = false;

    let waifuList = await queries.waifuList.getOne({
      userId: user.id,
      waifuImageId: waifuImage.id,
    });
    if (!waifuList)
      waifuList = await queries.waifuList.create(
        queryRunner,
        user.id,
        waifuImage.id
      );
    else if ((waifuList.quantity as number) + 1 <= 10)
      await queries.waifuList.update(queryRunner, waifuList.id, {
        quantity: (waifuList.quantity as number) + 1,
      });
    else waifuInMaxLevel = true;

    const newAddExp = (exp as number) * (waifuInMaxLevel ? 2 : 1);
    let newExp = (user.userInfo.exp as number) + newAddExp;
    const levelUp = (newExp as Number) >= user.userInfo.limitExp;
    const newLevel = (user.userInfo.level as number) + (levelUp ? 1 : 0);
    const newLimitExp =
      (user.userInfo.limitExp as number) + (newLevel % 5 === 0 ? 25 : 0);
    const newFavoritePages =
      (user.userInfo.favoritePages as number) +
      (levelUp && newLevel % 4 === 0 ? 1 : 0);
    const newCoins =
      (user.userInfo.coins as number) +
      (waifuImage.waifuRarity.cost as number) *
        _extraCoins(waifuInMaxLevel, levelUp);
    const newDiamonds =
      (user.userInfo.diamonds as number) +
      _extraDiamonds(waifuInMaxLevel, levelUp);
    if (levelUp) newExp -= user.userInfo.limitExp as number;

    await queries.user.updateInfo(queryRunner, user.id, {
      exp: newExp,
      level: newLevel,
      limitExp: newLimitExp,
      favoritePages: newFavoritePages,
      coins: newCoins,
      diamonds: newDiamonds,
    });

    return {
      levelUp,
      level: newLevel,
      addFavoritePage:
        (newFavoritePages as Number) > user.userInfo.favoritePages,
      favoritePages: newFavoritePages,
      exp: newAddExp,
    };
  } catch (error) {
    global.logger.error(error);
    console.error(error);
    throw error;
  }
};

export default { incorporate, addWaifuOnList };
