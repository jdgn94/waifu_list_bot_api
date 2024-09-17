import { Context } from "telegraf";

import i18n from "../../config/i18n";
import queries from "../../utils/queries";
import db, { Active } from "../../db";

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

const sendWaifu = async (ctx: Context) => {
  try {
    const chatId = ctx.chat!.id;
    const waifu = await queries.chat.sendWaifu(chatId);
    console.log(waifu);

    ctx.sendPhoto(waifu.publicUrl as string, {
      caption: i18n.__("waifuSended"),
      parse_mode: "MarkdownV2",
    });
  } catch (error) {
    global.logger.error(error);
    console.error(error);
    ctx.reply(i18n.__("initGroupError"));
    return;
  }
};

const incorporate = async (ctx: Context) => {
  // ctx.reply(i18n.__("incorporate"));
  const chatId = ctx.chat!.id;
  const chat = await queries.chat.getOne(chatId);
  if (!chat || !chat.characterActive) return;

  try {
    let textMessage: string[] = [];
    if (ctx.message && "text" in ctx.message)
      textMessage = ctx.message.text.split(" ").slice(1) as string[];

    const active = await db.getRepository(Active).findOne({
      where: {
        chatId: chat.id,
      },
      relations: [
        "waifuImage",
        // "waifuImage",
        // "waifuImage.waifu",
        // "waifuImage.waifu.waifuType",
        // "waifuImage.waifu.franchise",
        // "waifuImage.waifuRarity",
      ],
    });

    if (!active) return;
    console.log(active);
    console.log(textMessage);

    // let nameCorrect = false;
    // const waifuNameAndNickname = (
    //   active.waifuImage.waifu.name +
    //   " " +
    //   active.waifuImage.waifu.nickname
    // ).split(" ");
    // textMessage.map((txt) => {
    //   if (nameCorrect === true) return;
    //   waifuNameAndNickname.map((name) => {
    //     if (RegExp(txt).test(name)) nameCorrect = true;
    //     if (nameCorrect === true) return;
    //   });
    // });

    // if (!nameCorrect) {
    //   ctx.reply(i18n.__("noWaifuMatch"));
    //   return;
    // }

    // ctx.reply("nombre correcto");
  } catch (error) {
    global.logger.error(error);
    console.error(error);
    ctx.reply(i18n.__("initGroupError"));
    return;
  }
};

export { start, sendWaifu, incorporate };
