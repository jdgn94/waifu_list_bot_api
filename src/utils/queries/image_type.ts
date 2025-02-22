import { LessThanOrEqual, MoreThan, Like, Not, FindOneOptions } from "typeorm";
import db, { ImageType } from "../../db";
import uNumber from "../functions/number.utils";
import uArray from "../functions/array.utils";
import regExp from "../reg_exp";

export interface QueryExtras {
  specials?: string;
  order?: { column: string; type: "ASC" | "DESC" };
}

interface Optionals {
  icon?: string;
  initialDate?: Date;
  finalDate?: Date;
}

const index = async (name: string | null, query?: QueryExtras | null) => {
  try {
    let order: undefined | FindOneOptions<ImageType>["order"];
    if (query?.order) {
      switch (query.order.column) {
        case "id":
          order = { id: query.order.type };
          break;
        case "name":
          order = { name: query.order.type };
          break;
        case "icon":
          order = { icon: query.order.type };
          break;
        case "initialDate":
          order = { initialDate: query.order.type };
          break;
        case "finalDate":
          order = { finalDate: query.order.type };
          break;
        default:
          order = undefined;
          break;
      }
    }
    const imageTypes = await db.getRepository(ImageType).find({
      where: {
        name: name
          ? Like(name)
          : query?.specials
          ? query.specials == "true"
            ? Like("%special")
            : Not(Like("% special"))
          : undefined,
      },
      order,
    });

    return imageTypes;
  } catch (error) {
    throw error;
  }
};

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

const update = async (id: number, name: string, optionals?: Optionals) => {
  try {
    if (name.length < 4)
      throw new Error("Image type name must be at least 4 characters");
    if (optionals?.initialDate || optionals?.finalDate) {
      if (!optionals?.initialDate || !optionals?.finalDate)
        throw new Error("Initial date and final date are required");
      if (optionals?.initialDate >= optionals?.finalDate)
        throw new Error(
          "Initial date must be less than or equal to final date"
        );
    }
    if (optionals?.icon && !regExp.emoji.test(optionals.icon)) {
      throw new Error("Image type icon is not valid");
    }

    const imageType = await db.getRepository(ImageType).findOneBy({ id });
    if (!imageType) throw new Error("Image type not found");

    imageType.name = name;
    imageType.icon = optionals?.icon ?? imageType.icon;
    imageType.initialDate = optionals?.initialDate ?? imageType.initialDate;
    imageType.finalDate = optionals?.finalDate ?? imageType.finalDate;
    await db.getRepository(ImageType).save(imageType);
    return imageType;
  } catch (error) {
    throw error;
  }
};

const create = async (name: string, optionals?: Optionals) => {
  try {
    if (name.length < 4)
      throw new Error("Image type name must be at least 4 characters");
    if (optionals?.initialDate || optionals?.finalDate) {
      if (!optionals?.initialDate || !optionals?.finalDate)
        throw new Error("Initial date and final date are required");
      if (optionals?.initialDate >= optionals?.finalDate)
        throw new Error(
          "Initial date must be less than or equal to final date"
        );
    }
    if (optionals?.icon && !regExp.emoji.test(optionals.icon)) {
      throw new Error("Image type icon is not valid");
    }

    const imageType = new ImageType();
    imageType.name = name;
    imageType.icon = optionals?.icon ?? null;
    imageType.initialDate = optionals?.initialDate ?? null;
    imageType.finalDate = optionals?.finalDate ?? null;
    await db.getRepository(ImageType).save(imageType);
    return imageType;
  } catch (error) {
    throw error;
  }
};

export default { index, getRandom, update, create };
