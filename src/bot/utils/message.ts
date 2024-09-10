import { Context, Types } from "telegraf";

const sendMessage = async (
  ctx: Context,
  text: string,
  extra: Types.ExtraReplyMessage
) => {
  await ctx.reply(text, extra);
};

export default { sendMessage };
