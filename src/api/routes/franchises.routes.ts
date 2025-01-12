import { Request, Response, Router } from "express";
import fs from "fs";

import queries from "../../utils/queries";
import db from "../../db";
import { tokenData } from "../utils/middleware.utils";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { name = "", page = "1" } = req.query;
    const response = await queries.franchise.index(
      name.toString(),
      parseInt(page.toString())
    );

    res.statusMessage = "Franchises data";
    return res.status(200).json({
      franchises: response[0],
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
    const franchise = await queries.franchise.getOne(parseInt(id.toString()));

    res.statusMessage = "Franchise data";
    return res.status(200).json(franchise);
  } catch (error) {
    throw res.status(500).json({ message: error });
  }
});

router.post("/", tokenData, async (req: Request, res: Response) => {
  const user = req.user;
  if (!user || user.roleId === 3)
    return res.status(401).json({ message: "User Unauthorized." });

  const { name, nickname, web_page } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const queryRunner = db.createQueryRunner();
  await queryRunner.startTransaction();
  try {
    await queries.franchise.create(
      name,
      user.id,
      nickname,
      web_page,
      files["1"][0],
      queryRunner
    );
    await queryRunner.commitTransaction();
    if (files["1"][0]) {
      fs.unlinkSync(files["1"][0].path); // Delete the file.
    }
    res.statusMessage = "Franchise data";
    return res.status(200).json({ message: "Franchise updated" });
  } catch (error) {
    if (files["1"][0]) {
      fs.unlinkSync(files["1"][0].path); // Delete the file.
    }
    await queryRunner.rollbackTransaction();
    throw res.status(500).json({ message: error });
  }
});

router.put("/:id", tokenData, async (req: Request, res: Response) => {
  const user = req.user;
  if (!user || user.roleId === 3)
    return res.status(401).json({ message: "User Unauthorized." });

  const { id } = req.params;
  const { name, nickname, web_page } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const queryRunner = db.createQueryRunner();
  await queryRunner.startTransaction();
  try {
    await queries.franchise.update(
      parseInt(id),
      name,
      nickname,
      web_page,
      files["1"][0],
      queryRunner
    );
    await queryRunner.commitTransaction();
    if (files["1"][0]) {
      fs.unlinkSync(files["1"][0].path); // Delete the file.
    }
    res.statusMessage = "Franchise data";
    return res.status(200).json({ message: "Franchise updated" });
  } catch (error) {
    if (files["1"][0]) {
      fs.unlinkSync(files["1"][0].path); // Delete the file.
    }
    await queryRunner.rollbackTransaction();
    throw res.status(500).json({ message: error });
  }
});

export default router;
