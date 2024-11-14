import { Context } from "telegraf";

import i18n from "../../config/i18n";
import queries from "../../utils/queries";
import db, { Active, Chat } from "../../db";
import { expRandom } from "../utils";
import uUser from "../../utils/functions/user.util";

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

    ctx.sendPhoto(waifu.publicUrl, {
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
  const queryRunner = db.createQueryRunner();
  await queryRunner.startTransaction();

  try {
    let textMessage: string[] = [];
    if (ctx.message && "text" in ctx.message)
      textMessage = ctx.message.text.split(" ").slice(1);

    const active = await db.getRepository(Active).findOne({
      where: {
        chatId: chat.id,
      },
      relations: [
        "waifuImage",
        "waifuImage",
        "waifuImage.waifu",
        "waifuImage.waifu.waifuType",
        "waifuImage.waifu.franchise",
        "waifuImage.waifuRarity",
      ],
    });

    if (!active) return;
    console.log(active);
    console.log(textMessage);

    let nameCorrect = false;
    const waifuNameAndNickname = (
      active.waifuImage.waifu.name +
      " " +
      active.waifuImage.waifu.nickname
    ).split(" ");
    textMessage.map((txt) => {
      if (nameCorrect === true) return;
      waifuNameAndNickname.map((name) => {
        if (RegExp(name.toLowerCase()).test(txt.toLowerCase()))
          nameCorrect = true;
        if (nameCorrect === true) return;
      });
    });
    global.logger.info(`waifu name correct? ${nameCorrect}`);

    const waifuName =
      active.waifuImage.waifu.name +
      (active.waifuImage.waifu.nickname
        ? " \\- " + active.waifuImage.waifu.nickname
        : "");
    const franchiseName =
      active.waifuImage.waifu.franchise.name +
      (active.waifuImage.waifu.franchise.nickname
        ? " \\- " + active.waifuImage.waifu.franchise.nickname
        : "");

    if (!nameCorrect) {
      if (active.messageCount + 1 >= active?.limitMessage) {
        await queryRunner.manager
          .getRepository(Chat)
          .update({ id: chatId }, { characterActive: false });

        await queryRunner.manager
          .getRepository(Active)
          .delete({ id: active.id });

        await queryRunner.commitTransaction();
        ctx.reply(
          i18n.__("waifuScape", {
            waifuName,
            franchiseName,
          }),
          {
            parse_mode: "MarkdownV2",
            reply_parameters: {
              message_id: ctx.message!.message_id,
            },
          }
        );
        return;
      }

      await queryRunner.manager
        .getRepository(Active)
        .increment({ id: active.id }, "messageCount", 1);

      await queryRunner.commitTransaction();
      ctx.reply(i18n.__("noWaifuMatch"), {
        reply_parameters: {
          message_id: ctx.message!.message_id,
        },
      });
      return;
    }
    const exp = expRandom(active.waifuImage.waifuRarity.id);

    const result = await uUser.addWaifuOnList(
      queryRunner,
      ctx,
      active.waifuImage.id,
      exp
    );

    await queryRunner.manager
      .getRepository(Chat)
      .update({ id: chat.id }, { characterActive: false });

    await queryRunner.manager.getRepository(Active).delete({ id: active.id });

    await queryRunner.commitTransaction();

    ctx.reply(
      i18n.__("waifuIncorporate", {
        username: ctx.from!.first_name.replace("(", "\\(").replace(")", "\\)"),
        waifuName,
        franchiseName,
        exp: result.exp.toString(),
      }),
      {
        parse_mode: "MarkdownV2",
        reply_parameters: {
          message_id: ctx.message!.message_id,
        },
      }
    );

    if (result.levelUp || result.addFavoritePage) {
      let message = i18n.__("tada", {
        username: ctx.from!.first_name.replace("(", "\\(").replace(")", "\\)"),
      });
      if (result.levelUp)
        message += i18n.__("levelUp", {
          level: String(result.level),
        });
      if (result.addFavoritePage)
        message += i18n.__("wonFavoritePage", {
          favPages: String(result.favoritePages),
        });

      ctx.reply(message, {
        parse_mode: "MarkdownV2",
        reply_parameters: {
          message_id: ctx.message!.message_id,
        },
      });
    }
  } catch (error) {
    await queryRunner.rollbackTransaction();
    global.logger.error(error);
    console.error(error);
    ctx.reply(i18n.__("initGroupError"));
    return;
  }
};

export { start, sendWaifu, incorporate };
