import { Request, Response, Router } from "express";

import queries from "../../utils/queries";
import regExp from "../../utils/reg_exp";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { name = "" } = req.query;
    const waifus = await queries.waifuRarity.index(name.toString());

    res.statusMessage = "Waifu rarities data";
    return res.status(200).json(waifus);
  } catch (error) {
    throw res.status(500).json({ message: error });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, icon, cost } = req.body;
    if (typeof parseInt(id) !== "number")
      return res.status(400).json({ message: "Waifu rarity id is not valid" });
    if (!name)
      return res.status(400).json({ message: "Waifu rarity name is required" });
    if (name.length < 4)
      return res
        .status(400)
        .json({ message: "Waifu rarity name must be at least 4 characters" });
    if (!icon)
      return res.status(400).json({ message: "Waifu rarity icon is required" });
    if (!regExp.emoji.test(icon))
      return res
        .status(400)
        .json({ message: "Waifu rarity icon is not valid" });
    if (!cost)
      return res.status(400).json({ message: "Waifu rarity cost is required" });
    if (typeof parseInt(cost) !== "number")
      return res
        .status(400)
        .json({ message: "Waifu rarity cost is not valid" });

    const waifuRarity = await queries.waifuRarity.update(
      parseInt(id),
      name,
      icon,
      parseInt(cost)
    );

    res.statusMessage = "Waifu rarity data";
    return res.status(200).json(waifuRarity);
  } catch (error) {
    throw res.status(500).json({ message: error });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, icon, cost } = req.body;
    if (!name)
      return res.status(400).json({ message: "Waifu rarity name is required" });
    if (name.length < 4)
      return res
        .status(400)
        .json({ message: "Waifu rarity name must be at least 4 characters" });
    if (!icon)
      return res.status(400).json({ message: "Waifu rarity icon is required" });
    if (!regExp.emoji.test(icon))
      return res
        .status(400)
        .json({ message: "Waifu rarity icon is not valid" });
    if (!cost)
      return res.status(400).json({ message: "Waifu rarity cost is required" });
    if (typeof parseInt(cost) !== "number")
      return res
        .status(400)
        .json({ message: "Waifu rarity cost is not valid" });

    const waifuRarity = await queries.waifuRarity.create(
      name,
      icon,
      parseInt(cost)
    );

    res.statusMessage = "Waifu rarity data";
    return res.status(200).json(waifuRarity);
  } catch (error) {
    throw res.status(500).json({ message: error });
  }
});

export default router;
