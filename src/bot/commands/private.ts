import { Context } from "telegraf";
import queries from "../../utils/queries";
import i18n from "../../config/i18n";
import { getOrCreateUser } from "../utils";

const start = async (ctx: Context) => {
  try {
    const chatId = ctx.chat!.id;
    let language = ctx.message!.from.language_code;
    if (language !== "en" && language !== "es") language = "en";
    const chat = await queries.chat.getOne(chatId);
    console.log(chat);
    if (chat !== null) {
      await getOrCreateUser(ctx);
      ctx.reply(i18n.__("initPrivateExist"));
      return;
    }

    await getOrCreateUser(ctx);
    const newChat = await queries.chat.create(chatId, ctx.chat!.type, {
      language,
    });
    console.log(newChat);

    // TODO: add user on user table if not exists
    const name = ctx.message!.from.first_name;
    ctx.reply(i18n.__("initPrivateNew", { name }));

    return;
  } catch (error) {
    global.logger.error(error);
    console.error(error);
    ctx.reply(i18n.__("initPrivateError"));
    return;
  }
};

export { start };
