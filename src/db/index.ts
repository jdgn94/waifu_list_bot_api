import { DataSource } from "typeorm";

import { Task } from "./entity/task";
import { Role } from "./entity/role";
import { User } from "./entity/user";
import { UserInfo } from "./entity/user_info";
import { Chat } from "./entity/chat";
import { Franchise } from "./entity/franchise";
import { WaifuType } from "./entity/waifu_type";
import { Waifu } from "./entity/waifu";
import { WaifuRarity } from "./entity/waifu_rarity";
import { ImageType } from "./entity/image_type";
import { WaifuImage } from "./entity/waifu_image";
import { SpecialImage } from "./entity/special_image";
import { SpecialImageFranchise } from "./entity/special_image_franchise";
import { SpecialImageWaifu } from "./entity/special_image_waifu";
import { Active } from "./entity/active";
import { WaifuList } from "./entity/waifu_list";

export {
  Task,
  Role,
  User,
  UserInfo,
  Chat,
  Franchise,
  WaifuType,
  Waifu,
  WaifuRarity,
  ImageType,
  WaifuImage,
  SpecialImage,
  SpecialImageFranchise,
  SpecialImageWaifu,
  Active,
  WaifuList,
};

export default new DataSource({
  type: "mysql",
  host: process.env.DATABASE_HOST ?? "localhost",
  port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 3306,
  username: process.env.DATABASE_USER ?? "root",
  password: process.env.DATABASE_PASS ?? "",
  database: process.env.DATABASE_NAME ?? "test",
  logging: ["error", "warn"],
  logger: "file",
  // debug: process.env.NODE_ENV !== "production" ? true : false,
  entities: [
    Task,
    Role,
    User,
    UserInfo,
    Chat,
    Franchise,
    WaifuType,
    Waifu,
    WaifuRarity,
    ImageType,
    WaifuImage,
    SpecialImage,
    SpecialImageFranchise,
    SpecialImageWaifu,
    Active,
    WaifuList,
  ],
  synchronize: true,
});
