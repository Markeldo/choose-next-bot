const { Menu } = require("@grammyjs/menu");
const { Bot } = require("grammy");
const { JSONFilePreset } = require("lowdb/node");
const { Low, JSONFile } = require("lowdb");

type User = {
  name: string;
  chatId: string;
  lastPicked?: string;
};

type Data = {
  users: User[];
};

const file = "./db.json"; // Укажите имя вашего JSON-файла
const adapter = new JSONFile(file);
const db = new Low(adapter);

async function initDB() {
  // Чтение данных из файла
  await db.read();

  // Убедитесь, что структура данных инициализирована
  db.data ||= { users: [] };

  // Здесь вы можете продолжать с вашей логикой работы с db
}

initDB().then(() => {
  addUser("Alice", "1");
  addUser("Bob", "1");
});

// Функция для добавления пользователя
async function addUser(name: string, chatId: string) {
  await db.read();
  db.data.users.push({ name, lastPicked: undefined, chatId });
  await db.write();
}

// Функция для получения всех пользователей
async function getUsers() {
  await db.read();
  return db.data.users;
}
const bot = new Bot(token);

console.log(db);

const menu = new Menu("my-menu-identifier")
  .text("A", (ctx) => ctx.reply("Пошёл на фиг со своей А!"))
  .row()
  .text("Show users", (ctx) => {
    ctx.reply("S!");
  });

bot.use(menu);

// Reply to any message with "Hi there!".
bot.on("message", (ctx) => {
  console.log(ctx);
  console.log(ctx.chat);
  ctx.reply("Hi there!", {
    reply_markup: menu,
  });
});

bot.start();
