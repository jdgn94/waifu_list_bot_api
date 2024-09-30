import path from "path";
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production")
  dotenv.config({ path: path.join(__dirname, "../../.env") });

import db from ".";
import insertRoles from "./seeds/roles";
import insertImageTypes from "./seeds/image_types";
import insertFranchises from "./seeds/franchises";
import insertWaifuRarities from "./seeds/waifu_rarities";

const main = async () => {
  try {
    await db.initialize();
    await runSeeds();
  } catch (error) {
    console.log(error);
  }
  process.exit(0);
};

const runSeeds = async () => {
  const queryRunner = db.createQueryRunner();
  queryRunner.startTransaction();
  try {
    await insertRoles(queryRunner);
    await insertImageTypes(queryRunner);
    await insertFranchises(queryRunner);
    await insertWaifuRarities(queryRunner);

    await queryRunner.commitTransaction();
    console.log("all seeds inserted");
  } catch (error) {
    queryRunner.rollbackTransaction();
    throw error;
  }
};

main();
