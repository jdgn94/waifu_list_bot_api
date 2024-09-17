import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") dotenv.config();

import api from "./api/";
import bot from "./bot";
import db from "./db";
// import { format } from "@formkit/tempo";

const main = async () => {
  try {
    const port = await api.get("port");
    api.listen(port);
    global.logger.info(`Server on port: ${port}`);
    bot.launch();
    global.logger.info("Telegram bot init");
    await db.initialize();
    global.logger.info("Database init");
    return;
  } catch (err) {
    console.error(err);
    global.logger.error(err);
    return;
  }
};

main();
