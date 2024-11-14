import { QueryRunner } from "typeorm";

import { ImageType } from "..";

import imageTypes from "./image_types/index";

interface IImageType {
  id: number;
  name: string;
  icon?: string | null;
  initial_date?: string | null;
  final_date?: string | null;
}

const _formatter = (imageTypes: IImageType[]) => {
  const imageTypesFormatted: ImageType[] = [];

  imageTypes.map((i) => {
    const imageType = new ImageType();
    imageType.id = i.id;
    imageType.name = i.name;
    imageType.icon = i.icon ?? null;
    imageType.initialDate = i.initial_date
      ? new Date(i.initial_date.toString())
      : null;
    imageType.finalDate = i.final_date
      ? new Date(i.final_date.toString())
      : null;

    imageTypesFormatted.push(imageType);
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
