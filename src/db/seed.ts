import path from "path";
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production")
  dotenv.config({ path: path.join(__dirname, "../../.env") });

import db from ".";
import insertRoles from "./seeds/roles";
import insertImageTypes from "./seeds/image_types";
import insertFranchises from "./seeds/franchises";
import insertWaifuRarities from "./seeds/waifu_rarities";
import insertWaifuTypes from "./seeds/waifu_types";
import insertWaifus from "./seeds/waifus";
import insertWaifuImages from "./seeds/waifu_images";
import insertSpecialImages from "./seeds/special_images";
import insertSpecialImageFranchises from "./seeds/special_image_franchises";
import insertSpecialImageWaifus from "./seeds/special_image_waifus";
import insertTasks from "./seeds/tasks";

const main = async () => {
  try {
    console.info("Connecting to the database...");
    await db.initialize();
    console.info("Connection has been established successfully.");
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
    await insertWaifuTypes(queryRunner);
    await insertWaifus(queryRunner);
    await insertWaifuImages(queryRunner);
    await insertSpecialImages(queryRunner);
    await insertSpecialImageFranchises(queryRunner);
    await insertSpecialImageWaifus(queryRunner);
    await insertTasks(queryRunner);

    await queryRunner.commitTransaction();
    console.log("all seeds inserted");
  } catch (error) {
    queryRunner.rollbackTransaction();
    throw error;
  }
};

main();
