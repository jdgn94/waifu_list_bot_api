import { QueryRunner } from "typeorm";

import { Waifu } from "..";

import waifus from "./waifus/";

interface IWaifus {
  id: number;
  franchise_id: number;
  type_id: number;
  user_id?: number | null;
  name: string;
  nickname?: string | null;
  age?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

const _formatter = (waifuRarities: IWaifus[]) => {
  const waifusFormatted: Waifu[] = [];

  waifuRarities.map((i) => {
    const waifuFormatted = new Waifu();
    waifuFormatted.id = i.id;
    waifuFormatted.franchiseId = i.franchise_id;
    waifuFormatted.typeId = i.type_id;
    waifuFormatted.userId = i.user_id ?? null;
    waifuFormatted.name = i.name;
    waifuFormatted.nickname = i.nickname ?? null;
    waifuFormatted.age = i.age ?? 0;
    waifuFormatted.createdAt = i.created_at
      ? new Date(i.created_at)
      : new Date();
    waifuFormatted.updatedAt = i.updated_at
      ? new Date(i.updated_at)
      : new Date();

    waifusFormatted.push(waifuFormatted);
  });

  return waifusFormatted;
};

const insertWaifus = async (queryRunner: QueryRunner) => {
  console.log("insert waifus");

  waifus.forEach(async (waifu) => {
    const waifusFormatter = _formatter(waifu);
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Waifu)
      .values(waifusFormatter)
      .orUpdate([
        "name",
        "nickname",
        "age",
        "user_id",
        "franchise_id",
        "type_id",
      ])
      .execute();
  });
};

export default insertWaifus;
