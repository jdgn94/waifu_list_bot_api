import { Request, Response, Router } from "express";

import queries from "../../utils/queries";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { name = "" } = req.query;
    const waifuTypes = await queries.waifuType.index(name.toString());

    res.statusMessage = "Waifu types data";
    return res.status(200).json(waifuTypes);
  } catch (error) {
    throw res.status(500).json({ message: error });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ message: "Waifu type name is required" });

    if (name.length < 4)
      return res
        .status(400)
        .json({ message: "Waifu type name must be at least 4 characters" });

    const waifuType = await queries.waifuType.create(name);

    res.statusMessage = "Waifu type data";
    return res.status(200).json(waifuType);
  } catch (error) {
    throw res.status(500).json({ message: error });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (typeof parseInt(id) !== "number")
      return res.status(400).json({ message: "Waifu type id is not valid" });
    if (!name)
      return res.status(400).json({ message: "Waifu type name is required" });
    if (name.length < 4)
      return res
        .status(400)
        .json({ message: "Waifu type name must be at least 4 characters" });

    const waifuType = await queries.waifuType.update(parseInt(id), name);

    res.statusMessage = "Waifu type data";
    return res.status(200).json(waifuType);
  } catch (error) {
    throw res.status(500).json({ message: error });
  }
});

export default router;
