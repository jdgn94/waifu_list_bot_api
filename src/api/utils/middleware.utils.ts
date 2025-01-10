import { Request, Response, NextFunction } from "express";

import { decodeToken } from "./jwt.utils";
import queries from "../../utils/queries";

const tokenData = async (req: Request, res: Response, next: NextFunction) => {
  // res.setHeader('X-XSS-Protection', '1; mode=block');
  const token = req.headers.authorization?.replace("Bearer ", "");
  console.log(token);
  if (token) {
    const payload = decodeToken(token);
    if (payload) {
      const user = await queries.user.info(payload.telegramId);
      if (!user) {
        res.status(401).json({ message: "User not found" });
        return;
      }
      req.user = user;
      next();
    }
  }
  next();
};

export { tokenData };
