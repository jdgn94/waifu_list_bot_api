import { QueryRunner } from "typeorm";

import { WaifuType } from "..";

import waifuTypes from "./waifu_types/";

interface IWaifuType {
  id: number;
  name: string;
  created_at?: string | null;
  updated_at?: string | null;
}

const _formatter = (waifuRarities: IWaifuType[]) => {
  const waifuTypesFormatted: WaifuType[] = [];

  waifuRarities.map((i) => {
    const waifuType = new WaifuType();
    waifuType.id = i.id;
    waifuType.name = i.name;
    waifuType.createdAt = i.created_at ? new Date(i.created_at) : new Date();
    waifuType.updatedAt = i.updated_at ? new Date(i.updated_at) : new Date();

    waifuTypesFormatted.push(waifuType);
  });

  return waifuTypesFormatted;
};

const insertWaifuTypes = async (queryRunner: QueryRunner) => {
  console.log("insert waifu rarities");

  waifuTypes.forEach(async (waifuType) => {
    const waifuTypesFormatted = _formatter(waifuType);
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(WaifuType)
      .values(waifuTypesFormatted)
      .orUpdate(["name"])
      .execute();
  });
};

export default insertWaifuTypes;
