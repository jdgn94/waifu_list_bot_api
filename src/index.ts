import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") dotenv.config();

import api from "./api/";
import bot from "./bot";
import db from "./db";

const main = async () => {
  try {
    const port = await api.get("port");
    api.listen(port);
    global.logger.info(`Server on port: ${port}`);
    bot.launch();
    global.logger.info("Telegram bot init");
    await db.initialize();
    global.logger.info("Database init");

    // const res = await db.query("SELECT * FROM waifus LIMIT 10;");
    // console.log(res);
    return;
  } catch (err) {
    console.error(err);
    global.logger.error(err);
    return;
  }
};

main();
