import { Request, Response, Router } from "express";

import queries from "../../utils/queries";
import { createToken } from "../utils/jwt.utils";
import { tokenData } from "../utils/middleware.utils";

const router = Router();

router.get("/", tokenData, async (req: Request, res: Response) => {
  try {
    res.statusMessage = "Session data";
    return res.status(200).json({ user: req.user });
  } catch (error) {
    throw res.status(500).json({ message: error });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!id)
      return res.status(400).json({ message: "Telegram id is required" });

    const user = await queries.user.info(id);

    if (!user) return res.status(400).json({ message: "User not found" });
    const token = createToken({ id: user.id, telegramId: id });

    res.statusMessage = "Session data";
    return res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    throw res.status(500).json({ message: error });
  }
});

export default router;
