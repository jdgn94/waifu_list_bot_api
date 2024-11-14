import { QueryRunner } from "typeorm";

import queries from "../queries";
import { Context } from "telegraf";

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
  tgId: number,
  username: string,
  nickname: string
  // waifuImageId: number
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
  ctx: Context,
  waifuImageId: number,
  exp: number
) => {
  try {
    const userTgId = ctx.from!.id;
    let user = await queries.user.getOne(userTgId);
    const waifuImage = await queries.waifuImage.getOne(waifuImageId);
    global.logger.info("Estoy en la función para añadir la waifu a la lista");
    console.log(waifuImage);
    console.log(user);
    console.log(exp);

    if (!user) {
      user = await queries.user.create(
        userTgId,
        ctx.from!.username ?? ctx.from!.first_name,
        ctx.from!.first_name,
        { roleId: 3 }
      );
      if (!user) throw new Error("User not found");
    }
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
    else if (waifuList.quantity + 1 <= 10)
      await queries.waifuList.update(queryRunner, waifuList.id, {
        quantity: waifuList.quantity + 1,
      });
    else waifuInMaxLevel = true;

    const newAddExp = exp * (waifuInMaxLevel ? 2 : 1);
    let newExp = user.userInfo.exp + newAddExp;
    const levelUp = newExp >= user.userInfo.limitExp;
    const newLevel = user.userInfo.level + (levelUp ? 1 : 0);
    const newLimitExp = user.userInfo.limitExp + (newLevel % 5 === 0 ? 25 : 0);
    const newFavoritePages =
      user.userInfo.favoritePages + (levelUp && newLevel % 4 === 0 ? 1 : 0);
    const newCoins =
      user.userInfo.coins +
      waifuImage.waifuRarity.cost * _extraCoins(waifuInMaxLevel, levelUp);
    const newDiamonds =
      user.userInfo.diamonds + _extraDiamonds(waifuInMaxLevel, levelUp);
    if (levelUp) newExp -= user.userInfo.limitExp;

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
      addFavoritePage: newFavoritePages > user.userInfo.favoritePages,
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
