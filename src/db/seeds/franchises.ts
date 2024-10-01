import { QueryRunner } from "typeorm";

import { Franchise } from "..";

import franchises from "./franchises/";

interface Ifranchise {
  id: number;
  name: string;
  nickname?: string | null;
  user_id?: number | null;
  image?: string | null;
  web_page?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

const _formatter = (franchises: Ifranchise[]) => {
  const franchisesFormatted: Franchise[] = [];

  franchises.map((i) => {
    const newFranchise = new Franchise();
    newFranchise.id = i.id;
    newFranchise.name = i.name;
    newFranchise.nickname = i.nickname ?? null;
    newFranchise.userId = i.user_id ?? null;
    newFranchise.image = i.image ?? null;
    newFranchise.webPage = i.web_page ?? null;
    newFranchise.createdAt = i.created_at ? new Date(i.created_at) : new Date();
    newFranchise.updatedAt = i.updated_at ? new Date(i.updated_at) : new Date();

    franchisesFormatted.push(newFranchise);
  });

  return franchisesFormatted;
};

const insertFranchises = async (queryRunner: QueryRunner) => {
  console.log("insert franchises");

  franchises.forEach(async (franchise) => {
    const franchisesFormatter = _formatter(franchise);
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Franchise)
      .values(franchisesFormatter)
      .orUpdate(["name", "nickname", "user_id", "image", "web_page"])
      .execute();
  });
};

export default insertFranchises;
