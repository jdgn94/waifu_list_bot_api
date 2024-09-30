import { QueryRunner } from "typeorm";

import { WaifuRarity } from "..";

import waifuRarities from "./waifu_rarities/";

interface IWaifuRarity {
  id: number;
  name: string;
  icon: string;
  points: number;
  created_at?: string | null;
  updated_at?: string | null;
}

const _formatter = (waifuRarities: IWaifuRarity[]) => {
  const waifuRaritiesFormatted: WaifuRarity[] = [];

  waifuRarities.map((role) => {
    const waifuRarity = new WaifuRarity();
    waifuRarity.id = role.id;
    waifuRarity.name = role.name;
    waifuRarity.icon = role.icon;
    waifuRarity.cost = role.points;
    waifuRarity.createdAt = role.created_at
      ? new Date(role.created_at)
      : new Date();
    waifuRarity.updatedAt = role.updated_at
      ? new Date(role.updated_at)
      : new Date();

    waifuRaritiesFormatted.push(waifuRarity);
  });

  return waifuRaritiesFormatted;
};

const insertWaifuRarities = async (queryRunner: QueryRunner) => {
  console.log("insert waifu rarities");

  waifuRarities.forEach(async (waifuRarity) => {
    const waifuRaritiesFormatter = _formatter(waifuRarity);
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(WaifuRarity)
      .values(waifuRaritiesFormatter)
      .orUpdate(["name"])
      .execute();
  });
};

export default insertWaifuRarities;
