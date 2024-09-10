import db, { Chat } from "../../db";

const getOne = async (tgId: Number) => {
  try {
    const chat = await db
      .getRepository(Chat)
      .createQueryBuilder("chat")
      .where("chat.tg_id = :tgId", { tgId })
      .getOne();
    return chat;
  } catch (error) {
    console.error(error);
    global.logger.error(error);
    throw error;
  }
};

const create = async (tgId: Number, type: String, { language = "en" } = {}) => {
  try {
    if (type == "channel") throw new Error("Can't create channel chat");

    const chat = new Chat();
    chat.tgId = tgId;
    chat.type = type.toString();
    chat.language = language;
    await db.manager.save(chat);
    return chat;
  } catch (error) {
    console.error(error);
    global.logger.error(error);
    throw error;
  }
};

export default { getOne, create };
