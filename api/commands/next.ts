import { Composer } from "grammy";
import { MyContext } from "../types";
import { db, getUsersOfChat } from "model";
import { random, sortBy } from "es-toolkit";

const nextComposer = new Composer<MyContext>();

nextComposer.command("next", async (ctx) => {
  const chatId = ctx.chat.id;
  const users = sortBy(getUsersOfChat(chatId), [
    ({ lastPicked }) => lastPicked || 0,
  ]).slice(0, 4);
  if (users.length < 4) {
    ctx.reply(
      "Невозможно выбрать, потому что нет игроков или их слишком мало! Минимум - 4"
    );
    return;
  }

  const selectedIndex = random(users.length - 1);
  const selectedUser = users.at(selectedIndex);
  if (!selectedUser) {
    ctx.reply("Какая-то непонятная ошибка возникла. Попробуй ещё раз!");
    return;
  }
  await ctx.reply(
    `Давненько сидят тихо ${users
      .map(({ name }) => name.replace("@", ""))
      .join(", ")}. Так-так-так...`
  );
  setTimeout(
    async () =>
      await ctx.reply(`Следующим к доске вызывается ${selectedUser.name}`),
    2000
  );
  selectedUser.lastPicked = Date.now();
  db.write();
});

export { nextComposer };
