import express, { Request } from "express";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import multer, { FileFilterCallback, Options as MulterOptions } from "multer";
import path from "path";
import { v4 as uuid } from "uuid";

import { logger, stream } from "../config/winston";
import waifus from "./routes/waifus.routes";
import franchises from "./routes/franchises.routes";
import waifuTypes from "./routes/waifu_type.routes";
import waifuRarities from "./routes/waifu_rarity.routes";
import imageTypes from "./routes/image_type.routes";
import session from "./routes/session.routes";

const baseURL = "/api";

// initialization
const app = express();
const filePath = path.resolve("public/uploads");
global.logger = logger;

// settings
app.set("port", process.env.PORT || process.argv[2] || 5000);

// functions
const fileFilter = async (
  _: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const filetypes = /jpeg|jpg|png|gif|webp|webm|mp4/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(Error("Error: Solo imagenes!"));
  }
};

const cordOptions: CorsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// middleware
app.use(morgan("dev"));
app.use(morgan("combined", { stream }));
app.use(cors(cordOptions));
app.use(express.json());
app.use(express.static(filePath));
app.use(express.urlencoded({ extended: false }));
const storage = multer.diskStorage({
  destination: filePath,
  filename: (_, file, cb) => {
    console.log(file.path);
    cb(null, uuid() + path.extname(file.originalname));
  },
});
const limits: MulterOptions = {
  storage,
  limits: {
    fieldNameSize: 100,
    fieldSize: 1500000000,
  },
  fileFilter,
};
app.use(
  multer(limits).fields([
    { name: "1", maxCount: 1 },
    { name: "2", maxCount: 1 },
    { name: "3", maxCount: 1 },
    { name: "4", maxCount: 1 },
    { name: "5", maxCount: 1 },
    { name: "6", maxCount: 1 },
    { name: "7", maxCount: 1 },
    { name: "8", maxCount: 1 },
    { name: "9", maxCount: 1 },
    { name: "10", maxCount: 1 },
    { name: "11", maxCount: 1 },
    { name: "12", maxCount: 1 },
    { name: "13", maxCount: 1 },
    { name: "14", maxCount: 1 },
    { name: "15", maxCount: 1 },
    { name: "16", maxCount: 1 },
    { name: "17", maxCount: 1 },
    { name: "18", maxCount: 1 },
    { name: "19", maxCount: 1 },
    { name: "20", maxCount: 1 },
    { name: "21", maxCount: 1 },
    { name: "22", maxCount: 1 },
    { name: "23", maxCount: 1 },
    { name: "24", maxCount: 1 },
    { name: "25", maxCount: 1 },
    { name: "26", maxCount: 1 },
    { name: "27", maxCount: 1 },
    { name: "28", maxCount: 1 },
    { name: "29", maxCount: 1 },
    { name: "30", maxCount: 1 },
    { name: "31", maxCount: 1 },
    { name: "32", maxCount: 1 },
    { name: "33", maxCount: 1 },
    { name: "34", maxCount: 1 },
    { name: "35", maxCount: 1 },
    { name: "36", maxCount: 1 },
    { name: "37", maxCount: 1 },
    { name: "38", maxCount: 1 },
    { name: "39", maxCount: 1 },
    { name: "40", maxCount: 1 },
    { name: "41", maxCount: 1 },
    { name: "42", maxCount: 1 },
    { name: "43", maxCount: 1 },
    { name: "44", maxCount: 1 },
    { name: "45", maxCount: 1 },
    { name: "46", maxCount: 1 },
    { name: "47", maxCount: 1 },
    { name: "48", maxCount: 1 },
    { name: "49", maxCount: 1 },
    { name: "50", maxCount: 1 },
  ])
);

// routes
app.use(baseURL + "/waifus", waifus);
app.use(baseURL + "/franchises", franchises);
app.use(baseURL + "/waifu_types", waifuTypes);
app.use(baseURL + "/waifu_rarities", waifuRarities);
app.use(baseURL + "/image_types", imageTypes);
app.use(baseURL + "/session", session);

export default app;
