import { Composer } from "grammy";
import { MyContext } from "../types";
import { getUsersOfChat, updateUserByName } from "model";
import { random, sortBy } from "es-toolkit";
import { extractName } from "utils/extractName";

const nextComposer = new Composer<MyContext>();

const MIN_PARTICIPANTS_COUNT = 3;

nextComposer.command("next", async (ctx) => {
  const chatId = ctx.chat.id;
  const users = sortBy(getUsersOfChat(chatId), [
    ({ lastPicked }) => lastPicked || 0,
  ]).slice(0, MIN_PARTICIPANTS_COUNT);

  ctx.reply(JSON.stringify(users));

  if (users.length < MIN_PARTICIPANTS_COUNT) {
    ctx.reply(
      `Невозможно выбрать, потому что нет игроков или их слишком мало! Минимум - ${MIN_PARTICIPANTS_COUNT} 🤕`
    );
    return;
  }

  const selectedIndex = random(users.length - 1);
  const selectedUser = users.at(selectedIndex);
  if (!selectedUser) {
    ctx.reply("Какая-то непонятная ошибка возникла. Попробуй ещё раз! 🤕");
    return;
  }
  await ctx.reply(
    `Давненько сидят тихо ${users
      .map(({ name }) => extractName(name))
      .join(", ")}. Так-так-так... ⏳`
  );
  setTimeout(
    async () =>
      await ctx.reply(`Следующим ведущим назначается ${selectedUser.name} 🤴`, {
        parse_mode: "Markdown",
      }),
    2000
  );
  updateUserByName(selectedUser.name, Date.now());
});

export { nextComposer };
