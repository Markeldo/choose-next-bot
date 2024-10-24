import { Composer } from "grammy";
import { MyContext } from "../types";
import { addUser } from "model";

const addSelfComposer = new Composer<MyContext>();

addSelfComposer.command("add_self", async (ctx) => {
  if (!ctx.message) {
    ctx.reply("Не могу добавить пользователя. Ошибка отправки сообщения. ☠️");
    return;
  }

  const username = ctx.message?.from.username
    ? `@${ctx.message.from.username}`
    : `[${ctx.message.from.first_name}](tg://user?id=${ctx.message.from.id})`;
  const result = await addUser({
    id: ctx.message.from.id,
    name: username,
    chatId: ctx.chat.id,
  });
  if (!result) {
    ctx.reply(`Вы уже были добавлены в список ранее. Отмена действия 🙅‍♂️`);
  } else {
    ctx.reply(`Поздравляю, ${ctx.message.from.first_name}! Вы добавлены. 👍`);
  }
});

export { addSelfComposer };
