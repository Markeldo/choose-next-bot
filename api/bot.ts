import { Bot, GrammyError, HttpError, session, webhookCallback } from "grammy";
import { MyContext, SessionData } from "../src/types";
import { MENU, addUser } from "../src/model";
import { commands } from "../src/commands";
import { CONFIG } from "../src/config";
import { isValidTelegramAccount } from "../src/utils";

if (!CONFIG.TELEGRAM.TOKEN) {
  throw new Error("Oh, so bad");
}
const bot = new Bot<MyContext>(CONFIG.TELEGRAM.TOKEN);
bot.use(session({ initial: (): SessionData => ({ expectingAccount: false }) }));

bot.api.setMyCommands(MENU);

bot.use(commands);

// Фактическая регистрация пользователя. Пока не знаю, куда перераспределить
bot.on("::mention", async (ctx) => {
  const text = ctx.message?.text;
  const userId = ctx.update.message?.from.id;

  let message = `*${text}* добавлен в список игроков`;
  if (userId !== ctx.session.expectingAccount) {
    return;
  }

  if (text && isValidTelegramAccount(text)) {
    const result = await addUser({ name: text, chatId: ctx.chat.id });

    if (!result) {
      message = `Пользователь с ником ${text} уже был добавлены в игру ранее. Отмена действия`;
    }
  } else {
    message = "Что-то пошло не так. *Добавление отменено.*";
  }
  ctx.session.expectingAccount = false;
  ctx.reply(message);
});

// bot.on("message", () => {
//   console.log("ssssss");
// });

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Ошибка при обработке обновления ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Ошибка в запросе:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Не удалось связаться с Telegram:", e);
  } else {
    console.error("Неизвестная ошибка:", e);
  }
});

if (CONFIG.ENV === "dev") {
  bot.start();
}
export default webhookCallback(bot, "std/http");

export const config = {
  runtime: "nodejs",
};
