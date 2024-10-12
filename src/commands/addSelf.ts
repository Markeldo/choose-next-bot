import { Composer } from "grammy";
import { MyContext } from "../types";
import { addUser } from "model";

const addSelfComposer = new Composer<MyContext>();

addSelfComposer.command("add_self", async (ctx) => {
  if (!ctx.message?.from.username) {
    ctx.reply("Не могу добавить пользователя, потому что не указано имя");
    return;
  }
  const result = await addUser({
    name: `@${ctx.message?.from.username}`,
    chatId: ctx.chat.id,
  });
  if (!result) {
    ctx.reply(`Вы уже были добавлены в игру ранее. Отмена действия`);
  } else {
    ctx.reply(`Поздравляю, ${ctx.message.from.username}! Вы добавлены в игру.`);
  }
});

export { addSelfComposer };
