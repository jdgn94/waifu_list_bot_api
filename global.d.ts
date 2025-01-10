import { Logger } from "winston";

import { User } from "./src/db";

declare global {
  // namespace NodeJS {
  //   interface Global {
  //     logger: Logger;
  //   }
  // }
  var logger: Logger;

  declare namespace Express {
    export interface Request {
      user: User | null;
    }
  }
}
