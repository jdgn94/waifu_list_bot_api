import db, { Active, Chat } from "../../db";
import queries from "../queries";

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

const sendWaifu = async (tgId: Number) => {
  const queryRunner = db.createQueryRunner();
  try {
    await queryRunner.startTransaction();
    const chat = await getOne(tgId);
    if (!chat) throw new Error("Chat not found");
    if (chat.characterActive) throw new Error("There is an active waifu");

    const waifuImage = await queries.waifu.getRandom();
    await queryRunner.manager.update(
      Chat,
      { id: chat.id },
      { messageCount: 0, characterActive: true }
    );

    const active = new Active();
    active.chatId = chat.id;
    active.waifuImageId = waifuImage.id;
    active.limitMessage = chat.limitMessage;
    active.messageCount = 0;
    queryRunner.manager.save(active);

    await queryRunner.commitTransaction();
    return waifuImage;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error(error);
    global.logger.error(error);
    throw error;
  }
};

export default { getOne, create, sendWaifu };

// Leonora Nakiri
