import { Context } from "telegraf";
import db, { Chat } from "../../db";

const addMessageCountOnChat = async (ctx: Context) => {
  try {
    const chatId = ctx.chat!.id;
    const chat = await db
      .createQueryBuilder()
      .select()
      .from(Chat, "chat")
      .where("tg_id = :chatId", { chatId })
      .getOne();

    console.log(chat);
  } catch (error) {
    global.logger.error(`${error}: File utils; Function addMessageCountOnChat`);
  }
};

export { addMessageCountOnChat };
