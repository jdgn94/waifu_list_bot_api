import { Request, Response, Router } from "express";

import queries from "../../utils/queries";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { name = "" } = req.query;
    const waifus = await queries.waifuType.index(name.toString());
    return res.status(200).json({
      data: waifus,
      message: "Waifu types data",
    });
  } catch (error) {
    throw res.status(500).json({ message: error });
  }
});

export default router;