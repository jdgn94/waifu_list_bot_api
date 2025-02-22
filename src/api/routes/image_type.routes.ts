import { Request, Response, Router } from "express";

import queries from "../../utils/queries";
import { QueryExtras } from "../../utils/queries/image_type";
import regExp from "../../utils/reg_exp";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { name = "", specials = "", order = "", orderType = "" } = req.query;
    let orderQuery: QueryExtras["order"];
    if (order && orderType) {
      if (
        !["id", "name", "icon", "initialDate", "finalDate"].includes(
          order as string
        )
      )
        return res.status(400).json({ message: "Order column is not valid" });
      if (
        !["ASC", "DESC"].includes(orderType.toString().toUpperCase() as string)
      )
        return res.status(400).json({ message: "Order type is not valid" });

      orderQuery = {
        column: order as string,
        type: orderType.toString().toUpperCase() as "ASC" | "DESC",
      };
    }
    const imageTypes = await queries.imageType.index(name.toString(), {
      specials: specials.toString(),
      order: orderQuery,
    });

    res.statusMessage = "Image types data";
    return res.status(200).json(imageTypes);
  } catch (error) {
    throw res.status(500).json({ message: error });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, icon, initialDate, finalDate } = req.body;
    let initDate: Date | undefined;
    let endDate: Date | undefined;

    if (!name)
      return res.status(400).json({ message: "Image type name is required" });
    if (name.length < 4)
      return res
        .status(400)
        .json({ message: "Image type name must be at least 4 characters" });
    if (icon && !regExp.emoji.test(icon))
      return res.status(400).json({ message: "Image type icon is not valid" });
    if (initialDate || finalDate) {
      if (!initialDate || !finalDate)
        return res
          .status(400)
          .json({ message: "Initial date and final date are required" });

      initDate = new Date(initialDate);
      endDate = new Date(finalDate);
      if (initDate >= endDate)
        return res.status(400).json({
          message: "Initial date must be less than or equal to final date",
        });
    }

    const imageType = await queries.imageType.create(name, {
      icon,
      initialDate: initDate,
      finalDate: endDate,
    });

    await queries.imageType.create(name + " Special", {
      icon: icon + " 🌟",
      initialDate: initDate,
      finalDate: endDate,
    });

    res.statusMessage = "Image type data";
    return res.status(200).json(imageType);
  } catch (error) {
    throw res.status(500).json({ message: error });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, icon, initialDate, finalDate } = req.body;
    let initDate: Date | undefined;
    let endDate: Date | undefined;

    if (typeof parseInt(id) !== "number")
      return res.status(400).json({ message: "Image type id is not valid" });
    if (!name)
      return res.status(400).json({ message: "Image type name is required" });
    if (name.length < 4)
      return res
        .status(400)
        .json({ message: "Image type name must be at least 4 characters" });
    if (icon && !regExp.emoji.test(icon))
      return res.status(400).json({ message: "Image type icon is not valid" });
    if (initialDate || finalDate) {
      if (!initialDate || !finalDate)
        return res
          .status(400)
          .json({ message: "Initial date and final date are required" });

      initDate = new Date(initialDate);
      endDate = new Date(finalDate);
      if (initDate >= endDate)
        return res.status(400).json({
          message: "Initial date must be less than or equal to final date",
        });
    }

    const imageType = await queries.imageType.update(parseInt(id), name, {
      icon,
      initialDate: initDate,
      finalDate: endDate,
    });

    await queries.imageType.update(parseInt(id) + 1, name + " Special", {
      icon: icon + " 🌟",
      initialDate: initDate,
      finalDate: endDate,
    });

    res.statusMessage = "Image type data";
    return res.status(200).json(imageType);
  } catch (error) {
    throw res.status(500).json({ message: error });
  }
});

export default router;
