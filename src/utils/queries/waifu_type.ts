import { Like } from "typeorm";
import db, { WaifuType } from "../../db";

const index = async (name: string | null) => {
  try {
    const waifuTypes = await db.getRepository(WaifuType).find({
      where: {
        name: name ? Like(name) : undefined,
      },
      order: {
        name: "ASC",
      },
    });

    return waifuTypes;
  } catch (error) {
    throw error;
  }
};

const create = async (name: string) => {
  try {
    if (name.length < 4)
      throw new Error("Waifu rarity name must be at least 4 characters");
    const waifuType = new WaifuType();
    waifuType.name = name;
    await db.getRepository(WaifuType).save(waifuType);
    return waifuType;
  } catch (error) {
    throw error;
  }
};

const update = async (id: number, name: string) => {
  try {
    if (name.length < 4)
      throw new Error("Waifu rarity name must be at least 4 characters");
    const waifuType = await db.getRepository(WaifuType).findOneBy({ id });
    if (!waifuType) throw new Error("Waifu type not found");
    waifuType.name = name;
    await db.getRepository(WaifuType).save(waifuType);
    return waifuType;
  } catch (error) {
    throw error;
  }
};

export default { index, create, update };
