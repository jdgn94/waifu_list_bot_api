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

  franchises.map((role) => {
    const newFranchise = new Franchise();
    newFranchise.id = role.id;
    newFranchise.name = role.name;
    newFranchise.nickname = role.nickname ?? null;
    newFranchise.userId = role.user_id ?? null;
    newFranchise.image = role.image ?? null;
    newFranchise.webPage = role.web_page ?? null;
    newFranchise.createdAt = role.created_at
      ? new Date(role.created_at)
      : new Date();
    newFranchise.updatedAt = role.updated_at
      ? new Date(role.updated_at)
      : new Date();

    franchisesFormatted.push(newFranchise);
  });

  return franchisesFormatted;
};

const insertFranchises = async (queryRunner: QueryRunner) => {
  console.log("insert franchises");

  franchises.forEach(async (franchise) => {
    const rolesFormatter = _formatter(franchise);
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Franchise)
      .values(rolesFormatter)
      .orUpdate(["name", "nickname", "user_id", "image", "web_page"])
      .execute();
  });
};

export default insertFranchises;
