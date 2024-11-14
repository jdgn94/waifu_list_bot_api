import { LessThanOrEqual, MoreThan, Like, Not } from "typeorm";
import db, { ImageType } from "../../db";
import uNumber from "../functions/number.utils";
import uArray from "../functions/array.utils";

const getRandom = async () => {
  try {
    const today = new Date();
    console.log(today);
    const imageTypeActives = await db.getRepository(ImageType).find({
      where: {
        name: Not(Like("%special")),
        initialDate: LessThanOrEqual(today),
        finalDate: MoreThan(today),
      },
    });
    console.log(imageTypeActives);

    const actives: number[] = [1];
    imageTypeActives.map((imageTypeActive) => actives.push(imageTypeActive.id));
    console.log(actives);

    const activeQuantities = actives.length;
    const activesProbability = [];
    for (let i = 0; i < 70; i++) activesProbability.push(1);
    if (activeQuantities > 1) {
      // for (let i = 0; i < 20; i++) activesProbability.push(2);
      const activesSpecials = actives.splice(1);
      for (let i = 0; i < 30; i++)
        activesProbability.push(
          activesSpecials[uNumber.getRandom(0, activesSpecials.length - 1)]
        );
    } else {
      for (let i = 0; i < 30; i++) activesProbability.push(1);
    }

    console.log(activesProbability);
    const shuffleActivesProbability = uArray.shuffle(activesProbability);
    console.log(shuffleActivesProbability);

    const imageType = await db.getRepository(ImageType).findOne({
      where: {
        id: shuffleActivesProbability[
          uNumber.getRandom(0, shuffleActivesProbability.length)
        ],
      },
    });
    if (!imageType) throw new Error("There is no image type in database");
    console.log(imageType);
    return imageType;
  } catch (error) {
    console.error(error);
    global.logger.error(error);
    throw error;
  }
};

export default { getRandom };
