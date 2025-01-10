import { Request, Response, Router } from "express";
import fs from "fs";

import queries from "../../utils/queries";
import { tokenData } from "../utils/middleware.utils";
import db from "../../db";
import { ImageTypeFetch } from "../../interfaces/image_types";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { page = 1, name, franchise } = req.query;
    console.log(req.query);

    const response = await queries.waifu.index(
      page ? Number(page!) : null,
      name ? String(name) : null,
      franchise ? Number(franchise) : null
    );

    res.statusMessage = "Waifus data";
    return res.status(200).json({
      waifus: response[0],
      total_pages:
        parseInt((response[1] / 20).toString()) +
        (response[1] % 20 > 0 ? 1 : 0),
    });
  } catch (error) {
    throw res.status(500).json({ message: error });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const waifu = await queries.waifu.getOne(parseInt(id));
    res.statusMessage = "Waifu not found";
    return res.status(200).json(waifu);
  } catch (error) {
    throw res.status(500).json({ message: error });
  }
});

router.post("/", tokenData, async (req: Request, res: Response) => {
  const { name, nickname, age, franchise_id, type_id } = req.body;
  const images = req.body.images! as ImageTypeFetch[];
  const files = req.files as Express.Multer.File[];
  const queryRunner = db.createQueryRunner();
  await queryRunner.startTransaction();
  try {
    console.log("on function create waifu");
    if (!req.user || req.user.roleId !== 1)
      return res.status(401).json({ message: "User Unauthorized." });

    const waifu = await queries.waifu.create(
      name,
      nickname,
      age,
      franchise_id,
      type_id,
      req.user!.id,
      queryRunner
    );

    await Promise.all(
      images.map(async (image) => {
        const file = files.find(
          (file) => file.fieldname === image.imageType_id.toString()
        );
        if (file) {
          await queries.waifuImage.create(
            waifu.id,
            image.imageType_id,
            image.rarity_id,
            image.points,
            req.user!.id,
            file,
            { folder: "Waifu List Bot Telegram" },
            queryRunner
          );
        }
      })
    );

    files.map((file) => fs.unlinkSync(file.path));
    res.statusMessage = "Waifu created";
    return res.status(200).json(null);
  } catch (error) {
    files.map((file) => fs.unlinkSync(file.path));
    await queryRunner.rollbackTransaction();
    throw res.status(500).json({ message: error });
  }
});

router.put("/:id", tokenData, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, nickname, age, franchise_id, type_id } = req.body;
  const images = req.body.images! as ImageTypeFetch[];
  const files = req.files as Express.Multer.File[];
  const queryRunner = db.createQueryRunner();
  await queryRunner.startTransaction();
  try {
    await queries.waifu.update(
      parseInt(id),
      name,
      nickname,
      age,
      franchise_id,
      type_id,
      req.user!.id,
      queryRunner
    );

    await Promise.all(
      images.map(async (image) => {
        const file = files.find(
          (file) => file.fieldname === image.imageType_id.toString()
        );
        if (file) {
          await queries.waifuImage.create(
            parseInt(id),
            image.imageType_id,
            image.rarity_id,
            image.points,
            req.user!.id,
            file,
            { folder: "Waifu List Bot Telegram" },
            queryRunner
          );
        }
      })
    );

    await queryRunner.commitTransaction();
    res.statusMessage = "Waifu updated";
    return res.status(200);
  } catch (error) {
    console.log(error);
    files.map((file) => fs.unlinkSync(file.path));
    await queryRunner.rollbackTransaction();
    throw res.status(500).json({ message: error });
  }
});

export default router;
