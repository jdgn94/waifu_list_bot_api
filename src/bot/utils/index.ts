import { Context } from "telegraf";
import queries from "../../utils/queries";

const chatIsGroup = (ctx: Context) => {
  return ctx.chat!.type === "group" || ctx.chat!.type === "supergroup";
};

const getLanguage = async (ctx: Context) => {
  const messageLang = ctx.message!.from.language_code;
  const chatId = ctx.chat!.id;
  const chat = await queries.chat.getOne(chatId);
  if (chat) {
    return chat.language;
  } else {
    if (messageLang === "en" || messageLang === "es") return messageLang;
  }
  return "en";
};

const getOrCreateUser = async (ctx: Context) => {
  try {
    const userId = ctx.from!.id;
    const user = await queries.user.info(userId);

    if (!user) {
      const newUser = await queries.user.create(
        userId,
        ctx.from!.first_name,
        ctx.from?.username ?? ctx.from!.first_name,
        {
          roleId: 3,
        }
      );

      if (!newUser)
        throw new Error("Error creating user. Please try again later.");

      return newUser;
    }

    return user;
  } catch (error) {
    console.error(error);
    global.logger.error(error);
    throw error;
  }
};

export { chatIsGroup, getLanguage, getOrCreateUser };
