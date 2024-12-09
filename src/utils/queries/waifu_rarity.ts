import { Like } from "typeorm";
import db, { WaifuRarity } from "../../db";

const index = async (name: string | null) => {
  try {
    const waifuRarities = await db.getRepository(WaifuRarity).find({
      where: {
        name: name ? Like(name) : undefined,
      },
    });

    return waifuRarities;
  } catch (error) {
    throw error;
  }
};

export default { index };
