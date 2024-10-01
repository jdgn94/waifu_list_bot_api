import { QueryRunner } from "typeorm";

import { SpecialImageFranchise } from "..";

import specialImageFranchises from "./special_image_franchises/";

interface ISpecialImageFranchise {
  id: Number;
  special_image_id: number;
  franchise_id: number;
  user_id?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

const _formatter = (imageTypes: ISpecialImageFranchise[]) => {
  const imageTypesFormatted: SpecialImageFranchise[] = [];

  imageTypes.map((i) => {
    const specialImageFranchise = new SpecialImageFranchise();
    specialImageFranchise.id = i.id;
    specialImageFranchise.specialImageId = i.special_image_id;
    specialImageFranchise.franchiseId = i.franchise_id;
    specialImageFranchise.userId = i.user_id ?? null;
    specialImageFranchise.createdAt = i.created_at
      ? new Date(i.created_at)
      : new Date();
    specialImageFranchise.updatedAt = i.updated_at
      ? new Date(i.updated_at)
      : new Date();

    imageTypesFormatted.push(specialImageFranchise);
  });

  return imageTypesFormatted;
};

const insertSpecialImageFranchises = async (queryRunner: QueryRunner) => {
  console.log("insert special image franchises");

  specialImageFranchises.forEach(async (specialImageFranchise) => {
    const specialImageFranchisesFormatter = _formatter(specialImageFranchise);
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(SpecialImageFranchise)
      .values(specialImageFranchisesFormatter)
      .orUpdate(["special_image_id", "franchise_id", "user_id"])
      .execute();
  });
};

export default insertSpecialImageFranchises;
