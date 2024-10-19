import { Composer } from "grammy";
import { MyContext } from "../types";
import { addUser } from "model";

const addSelfComposer = new Composer<MyContext>();

addSelfComposer.command("add_self", async (ctx) => {
  if (!ctx.message) {
    ctx.reply("Не могу добавить пользователя. Ошибка отправки сообщения.");
    return;
  }

  const username = ctx.message?.from.username
    ? `@${ctx.message.from.username}`
    : `[${ctx.message.from.first_name}](tg://user?id=${ctx.message.from.id})`;
  const result = await addUser({
    name: username,
    chatId: ctx.chat.id,
  });
  if (!result) {
    ctx.reply(`Вы уже были добавлены в игру ранее. Отмена действия`);
  } else {
    ctx.reply(
      `Поздравляю, ${ctx.message.from.first_name}! Вы добавлены в игру.`
    );
  }
});

export { addSelfComposer };
