import { Like } from "typeorm";
import db, { WaifuType } from "../../db";

const index = async (name: string | null) => {
  try {
    const waifuTypes = await db.getRepository(WaifuType).find({
      where: {
        name: name ? Like(name) : undefined,
      },
    });

    return waifuTypes;
  } catch (error) {
    throw error;
  }
};

export default { index };
