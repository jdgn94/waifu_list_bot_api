import express, { Request } from "express";
import cors from "cors";
import morgan from "morgan";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { v4 as uuid } from "uuid";

import { logger, stream } from "../config/winston";
import waifus from "./routes/waifus.routes";
import franchises from "./routes/franchises.routes";
import waifuTypes from "./routes/waifu_type.routes";
import waifuRarities from "./routes/waifu_rarity.routes";
import imageTypes from "./routes/image_type.routes";

const baseURL = "/api";

// initialization
const app = express();
global.logger = logger;

// settings
app.set("port", process.env.PORT || 5000);

// functions
const fileFilter = async (
  _: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(Error("Error: Solo imagenes!"));
  }
};

// middleware
app.use(morgan("dev"));
app.use(morgan("combined", { stream }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/uploads"),
  filename: (_, file, cb) => {
    console.log(file.path);
    cb(null, uuid() + path.extname(file.originalname));
  },
});
const limits = {
  storage,
  limits: {
    fieldNameSize: 100,
    fieldSize: 1500000000,
  },
  fileFilter,
};
app.use(
  multer(limits).fields([
    { name: "image", maxCount: 1 },
    { name: "fav_img", maxCount: 1 },
    { name: "summer_img", maxCount: 1 },
    { name: "winter_img", maxCount: 1 },
    { name: "spring_img", maxCount: 1 },
    { name: "fall_img", maxCount: 1 },
  ])
);

// routes
app.use(baseURL + "/waifus", waifus);
app.use(baseURL + "/franchises", franchises);
app.use(baseURL + "/waifu_types", waifuTypes);
app.use(baseURL + "/waifu_rarities", waifuRarities);
app.use(baseURL + "/image_types", imageTypes);

export default app;
