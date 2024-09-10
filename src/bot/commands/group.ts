import { Context } from "telegraf";

import i18n from "../../config/i18n";
import queries from "../../utils/queries";

const start = async (ctx: Context) => {
  try {
    const chatId = ctx.chat!.id;
    const chat = await queries.chat.getOne(chatId);

    if (chat) {
      ctx.reply(i18n.__("initGroupExist"));
      return;
    }
    await queries.chat.create(chatId, ctx.chat!.type);

    await ctx.reply(i18n.__("initGroupNew"));
    // TODO: send character on chat
  } catch (error) {
    global.logger.error(error);
    console.error(error);
    ctx.reply(i18n.__("initGroupError"));
    return;
  }
};

export { start };
