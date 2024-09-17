import { DataSource } from "typeorm";
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
import { WaifuSpecialImage } from "./entity/waifu_special_image";
import { WaifuSpecialFranchise } from "./entity/waifus_special_franchise";
import { WaifuSpecialWaifu } from "./entity/waifu_special_waifu";
import { Active } from "./entity/active";

export {
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
  WaifuSpecialImage,
  WaifuSpecialFranchise,
  WaifuSpecialWaifu,
  Active,
};

export default new DataSource({
  type: "mysql",
  host: process.env.DATABASE_HOST ?? "localhost",
  port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 3306,
  username: process.env.DATABASE_USER ?? "root",
  password: process.env.DATABASE_PASS ?? "",
  database: process.env.DATABASE_NAME_DEV ?? "test",
  // debug: process.env.NODE_ENV !== "production" ? true : false,
  entities: [
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
    WaifuSpecialImage,
    WaifuSpecialFranchise,
    WaifuSpecialWaifu,
    Active,
  ],
  synchronize: true,
  // migrations: [],
});
