import { Composer } from "grammy";
import { MyContext } from "../types";
import { addUser } from "model";

const addSelfComposer = new Composer<MyContext>();

addSelfComposer.command("add_self", async (ctx) => {
  if (!ctx.message) {
    ctx.reply("Не могу добавить пользователя. Ошибка отправки сообщения. ☠️");
    return;
  }
  console.table(ctx.chat);
  console.table(ctx.message.message_thread_id);

  const username = ctx.message?.from.username
    ? `@${ctx.message.from.username}`
    : `[${ctx.message.from.first_name}](tg://user?id=${ctx.message.from.id})`;
  const result = await addUser({
    id: ctx.message.from.id,
    name: username,
    chatId: ctx.chat.id,
  });
  if (!result) {
    ctx.reply(`Вы уже были добавлены в список ранее. Отмена действия 🙅‍♂️`, {
      message_thread_id: ctx.message.message_thread_id,
    });
  } else {
    ctx.reply(`Поздравляю, ${ctx.message.from.first_name}! Вы добавлены. 👍`, {
      message_thread_id: ctx.message.message_thread_id,
    });
  }
});

export { addSelfComposer };
