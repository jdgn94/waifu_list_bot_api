import { Context, Telegraf } from "telegraf";
import { chatIsGroup, getLanguage } from "./utils";

import { info } from "./commands";
import { start as startGroup, sendWaifu, incorporate } from "./commands/group";
import { start as startPrivate } from "./commands/private";
import i18n from "../config/i18n";

// import commands from "./commands/";

// import { getLanguage, addMessageCount } from "./utils";

const bot = new Telegraf(process.env.TOKEN_TG!);

// middleware
bot.use(async (ctx, next) => {
  global.logger.info(`new message on bot from: ${ctx.message?.from.username}`);
  console.time(`Processing update ${ctx.update.update_id}`);
  const language = await getLanguage(ctx);
  i18n.setLocale(language.toString());

  // await addMessageCount(ctx);
  await next();
  console.timeEnd(`Processing update ${ctx.update.update_id}`);
});

// commands
bot.command(["start", "inicio", "iniciar"], async (ctx: Context) => {
  global.logger.debug("Tipo de chat: " + ctx.message?.chat.type);
  if (chatIsGroup(ctx)) {
    await startGroup(ctx);
  } else {
    await startPrivate(ctx);
  }
  return;
});

bot.command(["info", "information", "informacion", "información"], info);

bot.command(["send", "enviar"], (ctx: Context) => {
  if (!chatIsGroup(ctx)) return;
  sendWaifu(ctx);
});

bot.command(["incorporate", "incorporar"], (ctx: Context) => {
  if (!chatIsGroup(ctx)) return;
  incorporate(ctx);
});

// on
bot.on("message", async (ctx) => {
  global.logger.info(JSON.stringify(ctx.message));
  // if (await utils.verifyGroup(ctx)) await utils.addCountInChat(ctx);
  return;
});

export default bot;
