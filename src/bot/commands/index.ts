import { Context } from "telegraf";
import i18n from "../../config/i18n";
import { chatIsGroup } from "../utils";
import queries from "../../utils/queries";

const info = async (ctx: Context) => {
  try {
    const user = await queries.user.info(ctx.from!.id);
    let text = "";
    if (user === null) {
      ctx.reply(i18n.__("noUser"));
      return;
    }

    if (!chatIsGroup(ctx)) text += `Telegram ID: \*${ctx.from!.id}\*\n`;
    text += `${i18n.__("infoFrom")}: \*${user.username
      .replace("(", "\\(")
      .replace(")", "\\)")}\*\n\n`;
    text += `${i18n.__("level")}: \*${
      user.userInfo.level
    }\* ![🆙](tg://emoji?id=5364105043907716258)\n`;
    text += `${i18n.__("exp")}: \*${user.userInfo.exp} / ${
      user.userInfo.limitExp
    }\* ![✨](tg://emoji?id=5472164874886846699)\n`;
    if (!chatIsGroup(ctx)) {
      text += `${i18n.__("coins")}: \*${
        user.userInfo.coins
      }\* ![🪙](tg://emoji?id=5379600444098093058)\n`;
      text += `${i18n.__("diamonds")}: \*${
        user.userInfo.diamonds
      }\* ![💎](tg://emoji?id=5471952986970267163)\n`;
      text += `${i18n.__("goldenTickets")}: \*${
        user.userInfo.goldenTickets
      }\* ![🎫](tg://emoji?id=5418010521309815154)\n`;
    }
    text += `${i18n.__("favoritePages")}: \*${
      user.userInfo.favoritePages
    }\* ![⭐️](tg://emoji?id=5435957248314579621)\n`;
    ctx.reply(text, {
      parse_mode: "MarkdownV2",
      // protect_content: true,
      reply_parameters: {
        message_id: ctx.message!.message_id,
      },
    });
    return;
  } catch (error) {
    console.error(error);
    global.logger.error(error);
    ctx.reply(i18n.__("unexpectedError"));
    return;
  }
};

export { info };
