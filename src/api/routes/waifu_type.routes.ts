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

export default router;
