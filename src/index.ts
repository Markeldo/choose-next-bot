import { Menu } from "@grammyjs/menu";
import { Bot, Context, session, SessionFlavor } from "grammy";
import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import { CONFIG } from "./config.js";

type SessionData = {
  expectingAccount: string | number | false;
};
// Мы расширяем базовый контекст с помощью SessionFlavor
type MyContext = Context & SessionFlavor<SessionData>;

// Функция для валидации учётки Telegram
const isValidTelegramAccount = (input: string) => {
  const regex = /^@?[a-zA-Z0-9_]{5,32}$/; // Учётка должна содержать от 5 до 32 символов
  return regex.test(input);
};

const bot = new Bot<MyContext>(CONFIG.TELEGRAM.TOKEN);
bot.use(session({ initial: (): SessionData => ({ expectingAccount: false }) }));

type User = {
  name: string;
  chatId: number;
  lastPicked?: string;
};

type Data = {
  users: User[];
};
// Read or create db.json
const defaultData = { users: [] };

let db: Low<Data>;
async function initDB() {
  return await JSONFilePreset<Data>("./src/db.json", defaultData);
}
initDB().then((result) => {
  db = result;
});
bot.api.setMyCommands([
  { command: "add", description: "Добавить игрока" },
  { command: "list", description: "Вывести список участников" },
]);

const menu = new Menu("my-menu-identifier")
  .text("A", (ctx) => ctx.reply("Пошёл на фиг со своей А!"))
  .row()
  .text("a", (ctx) => {
    ctx.reply("a");
  });

bot.use(menu);

bot.command("add", async (ctx) => {
  ctx.session.expectingAccount = ctx.update.message?.from.id || false;
  await ctx.reply(`Добавить человечка в игру`);
});

bot.command("list", (ctx) => {
  const result = db.data.users
    .map(
      ({ name, lastPicked = "_никогда_" }) =>
        `${name.replace("@", "")}:\t${lastPicked}`
    )
    .join("\n");
  ctx.reply("*Кто в чате и когда вызывался к доске*\n\n" + result, {
    parse_mode: "MarkdownV2",
  });
});

bot.on("message:text", async (ctx) => {
  const text = ctx.message.text?.split(" ")[0];
  let message = `*${text}* добавлен в список игроков`;
  const userId = ctx.update.message?.from.id;
  console.log(userId);
  if (userId !== ctx.session.expectingAccount) {
    console.log(userId, ctx.session.expectingAccount);
    return;
  }
  console.log(isValidTelegramAccount(text), text);
  if (text && isValidTelegramAccount(text)) {
    await db.data.users.push({
      name: text,
      chatId: ctx.chat.id,
    });
    await db.write();
  } else {
    message = "Что-то пошло не так. *Добавление отменено.*";
  }
  ctx.session.expectingAccount = false;
  ctx.reply(message);
});

// Reply to any message with "Hi there!".
/*bot.on("message", (ctx) => {
  console.log(ctx);
  console.log(ctx.chat);
  ctx.reply("Hi there!", {
    reply_markup: menu,
  });
  setTimeout(() => {
    ctx.api.sendMessage(ctx.chat.id, "Муахахаха!");
  }, 3000);
});*/

bot.start();
