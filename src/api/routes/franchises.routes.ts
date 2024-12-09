import { Request, Response, Router } from "express";

import queries from "../../utils/queries";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { name = "" } = req.query;
    const franchises = await queries.franchise.index(name.toString());

    return res.status(200).json({
      data: franchises,
      message: "Franchises data",
    });
  } catch (error) {
    throw res.status(500).json({ message: error });
  }
});

export default router;
