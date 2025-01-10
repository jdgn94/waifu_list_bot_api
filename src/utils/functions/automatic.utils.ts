import { addYear } from "@formkit/tempo";
import { Equal, LessThan, Like, Not, Or } from "typeorm";

import db, { Task, ImageType, Chat } from "../../db";
import bot from "../../bot";
import i18n from "../../config/i18n";

const main = async () => {
  // INFO: first init automatic process
  _changeDate();
  setTimeout(() => _alertChangeEventStatus(), 10000);
  setTimeout(() => _updateEventStatus(), 20000);
  // INFO: programer process
  setInterval(_changeDate, 60000);
  setTimeout(() => setInterval(_alertChangeEventStatus, 60000), 10000);
  setTimeout(() => setInterval(_updateEventStatus, 60000), 20000);
  return;
};

const _changeDate = async () => {
  const date = new Date();
  if (date.getHours() === 0 && date.getMinutes() === 0) {
    global.logger.info("Change date");
    await db.getRepository(Task).update({}, { complete: false });
  }
  return;
};

const _alertChangeEventStatus = async () => {
  if (new Date().getHours() >= 0 && new Date().getMinutes() > 1) return;
  const queryRunner = db.createQueryRunner();
  await queryRunner.startTransaction();
  try {
    const task = await db.getRepository(Task).findOne({ where: { id: 1 } });
    if (task?.complete === false) {
      const today = new Date();
      const todayFormat = `${today.getFullYear()}-${
        today.getMonth() + 1
      }-${today.getDate()}`;
      await queryRunner.manager
        .getRepository(Task)
        .update({ id: 1 }, { complete: true });
      const eventFinish = await queryRunner.manager
        .getRepository(ImageType)
        .find({
          where: {
            name: Not(Like("% special")),
            finalDate: new Date(todayFormat),
          },
        });

      const chats = await queryRunner.manager.getRepository(Chat).find({
        where: {
          type: Or(Equal("group"), Equal("supergroup")),
        },
      });
      eventFinish.map((event) => {
        chats.map(async (chat) => {
          i18n.setLocale(chat.language);
          const message = i18n.__("eventFinish", { name: i18n.__(event.name) });
          await bot.telegram.sendMessage(chat.tgId, message);
        });
      });

      const eventStart = await queryRunner.manager
        .getRepository(ImageType)
        .find({
          where: {
            name: Not(Like("% special")),
            initialDate: new Date(todayFormat),
          },
        });
      eventStart.map((event) => {
        chats.map(async (chat) => {
          i18n.setLocale(chat.language);
          const message = i18n.__("eventStart", { name: i18n.__(event.name) });
          await bot.telegram.sendMessage(chat.tgId, message);
        });
      });
    }
    await queryRunner.commitTransaction();
  } catch (error) {
    queryRunner.rollbackTransaction();
    global.logger.error(error);
  }
  return;
};

const _updateEventStatus = async () => {
  if (new Date().getHours() >= 0 && new Date().getMinutes() > 1) return;
  const queryRunner = db.createQueryRunner();
  await queryRunner.startTransaction();
  try {
    const task = await db.getRepository(Task).findOne({ where: { id: 2 } });
    if (task?.complete === false) {
      await queryRunner.manager
        .getRepository(Task)
        .update({ id: 2 }, { complete: true });
      const imageTypes = await queryRunner.manager
        .getRepository(ImageType)
        .find({ where: { finalDate: LessThan(new Date()) } });
      for (const imageType of imageTypes) {
        await queryRunner.manager.update(
          ImageType,
          { id: imageType.id },
          {
            initialDate: addYear(imageType.initialDate!, 1),
            finalDate: addYear(imageType.finalDate!, 1),
          }
        );
      }
    }
    await queryRunner.commitTransaction();
  } catch (error) {
    queryRunner.rollbackTransaction();
    global.logger.error(error);
  }
};

export default main;
