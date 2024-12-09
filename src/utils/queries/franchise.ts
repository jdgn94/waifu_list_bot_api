import { Like } from "typeorm";
import db, { Franchise } from "../../db";

const index = async (name: string | null) => {
  try {
    const franchises = await db.getRepository(Franchise).find({
      where: {
        name: name ? Like(name) : undefined,
        nickname: name ? Like(name) : undefined,
      },
      order: {
        name: "ASC",
      },
    });

    return franchises;
  } catch (error) {
    throw error;
  }
};

export default { index };
