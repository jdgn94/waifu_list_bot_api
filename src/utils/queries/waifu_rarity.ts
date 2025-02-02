import { Like } from "typeorm";

import db, { WaifuRarity } from "../../db";
import regExp from "../reg_exp";

const index = async (name: string | null) => {
  try {
    const waifuRarities = await db.getRepository(WaifuRarity).find({
      where: {
        name: name ? Like(name) : undefined,
      },
      order: {
        cost: "ASC",
      },
    });

    return waifuRarities;
  } catch (error) {
    throw error;
  }
};

const update = async (id: number, name: string, icon: string, cost: number) => {
  try {
    if (name.length < 4)
      throw new Error("Waifu rarity name must be at least 4 characters");
    if (!regExp.emoji.test(icon))
      throw new Error("Waifu rarity icon is not valid");
    if (cost < 0) throw new Error("Waifu rarity cost must be greater than 0");

    const waifuRarity = await db.getRepository(WaifuRarity).findOneBy({ id });
    if (!waifuRarity) throw new Error("Waifu rarity not found");

    waifuRarity.name = name;
    waifuRarity.icon = icon;
    waifuRarity.cost = cost;
    await db.getRepository(WaifuRarity).save(waifuRarity);
    return waifuRarity;
  } catch (error) {
    throw error;
  }
};

const create = async (name: string, icon: string, cost: number) => {
  try {
    if (name.length < 4)
      throw new Error("Waifu rarity name must be at least 4 characters");
    if (!regExp.emoji.test(icon))
      throw new Error("Waifu rarity icon is not valid");
    if (cost < 0) throw new Error("Waifu rarity cost must be greater than 0");

    const waifuRarity = new WaifuRarity();
    waifuRarity.name = name;
    waifuRarity.icon = icon;
    waifuRarity.cost = cost;
    await db.getRepository(WaifuRarity).save(waifuRarity);
    return waifuRarity;
  } catch (error) {
    console.error("error in create waifu rarity");
    throw error;
  }
};

export default { index, update, create };
