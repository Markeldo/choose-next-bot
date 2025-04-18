import { Bot, GrammyError, HttpError, session } from "grammy";
import { CONFIG } from "./config";
import { MyContext, SessionData } from "./types";
import { MENU, addUser, deleteUserInChat } from "./model";
import { commands } from "./commands";
import { isValidTelegramAccount } from "utils";

if (!CONFIG.TELEGRAM.TOKEN) {
  throw new Error(
    "No token. Please create .env file in the root directory and set TELEGRAM_TOKEN variable there"
  );
}
const bot = new Bot<MyContext>(CONFIG.TELEGRAM.TOKEN);
bot.use(session({ initial: (): SessionData => ({ expectingAccount: false }) }));

bot.api.setMyCommands(MENU);

bot.use(commands);

// Фактическая регистрация пользователя. Пока не знаю, куда перераспределить
bot.on("::mention", async (ctx) => {
  const text = ctx.message?.text;
  const userId = ctx.update.message?.from.id;

  let message = `*${text}* добавлен в список`;
  if (userId !== ctx.session.expectingAccount || !ctx.message) {
    return;
  }

  if (text && isValidTelegramAccount(text)) {
    const result = await addUser({
      name: text,
      chatId: ctx.chat.id,
      id: ctx.message.from.id,
    });

    if (!result) {
      message = `Пользователь с ником ${text} уже был добавлены в игру ранее. Отмена действия`;
    }
  } else {
    message = "Что-то пошло не так. *Добавление отменено.*";
  }
  ctx.session.expectingAccount = false;
  ctx.reply(message);
});

bot.on("callback_query:data", async (ctx) => {
  const [action, ...rest] = ctx.update.callback_query.data.split(" ");
  const payload = rest.join(" ");
  switch (action) {
    case "removeUser":
      try {
        if (!ctx.chat) {
          throw new Error();
        }
        await deleteUserInChat(Number(payload), ctx.chat.id);
        ctx.reply(`Выбранный пользователь был удалён из списка участников☠️`, {
          parse_mode: "HTML",
          message_thread_id: ctx.callbackQuery?.message?.message_thread_id,
        });
      } catch {
        ctx.reply("Не получилось удалить участника. 😱", {
          message_thread_id: ctx.callbackQuery?.message?.message_thread_id,
        });
      }
      break;
    default:
      ctx.reply("Неизвестное действие. Ничего делать не буду 😝", {
        message_thread_id: ctx.callbackQuery?.message?.message_thread_id,
      });
  }
});

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
bot.start();
