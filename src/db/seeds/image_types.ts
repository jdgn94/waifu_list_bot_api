import { QueryRunner } from "typeorm";

import { ImageType } from "..";

import imageTypes from "./image_types/index";

interface IImageType {
  id: Number;
  name: String;
  icon?: String | null;
  initial_date?: String | null;
  final_date?: String | null;
}

const _formatter = (imageTypes: IImageType[]) => {
  const imageTypesFormatted: ImageType[] = [];

  imageTypes.map((role) => {
    const newImageType = new ImageType();
    newImageType.id = role.id;
    newImageType.name = role.name;
    newImageType.icon = role.icon ?? null;
    newImageType.initialDate = role.initial_date
      ? new Date(role.initial_date.toString())
      : null;
    newImageType.finalDate = role.final_date
      ? new Date(role.final_date.toString())
      : null;

    imageTypesFormatted.push(newImageType);
  });

  return imageTypesFormatted;
};

const insertImageTypes = async (queryRunner: QueryRunner) => {
  console.log("insert image types");

  imageTypes.forEach(async (imageType) => {
    const imageTypesFormatter = _formatter(imageType);
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(ImageType)
      .values(imageTypesFormatter)
      .orUpdate(["name", "icon", "initial_date", "final_date"])
      .execute();
  });
};

export default insertImageTypes;
