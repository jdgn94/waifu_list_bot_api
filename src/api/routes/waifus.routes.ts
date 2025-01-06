import { Request, Response, Router } from "express";

import queries from "../../utils/queries";

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

    return res.status(200).json({
      data: {
        waifus: response[0],
        total_pages:
          parseInt((response[1] / 20).toString()) +
          (response[1] % 20 > 0 ? 1 : 0),
      },
      message: "Waifus data",
    });
  } catch (error) {
    throw res.status(500).json({ message: error });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const waifu = await queries.waifu.getOne(parseInt(id));
    return res.status(200).json({ data: waifu, message: "Waifu data" });
  } catch (error) {
    throw res.status(500).json({ message: error });
  }
});

export default router;
