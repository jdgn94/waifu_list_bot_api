import { Request, Response, Router } from "express";

import queries from "../../utils/queries";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { name = "", specials = "" } = req.query;
    console.log(req.query);
    const imageTypes = await queries.imageType.index(name.toString(), {
      specials: specials.toString(),
    });

    res.statusMessage = "Image types data";
    return res.status(200).json(imageTypes);
  } catch (error) {
    throw res.status(500).json({ message: error });
  }
});

export default router;
