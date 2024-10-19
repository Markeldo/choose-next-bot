import { Composer, InlineKeyboard } from "grammy";
import { MyContext } from "../types";
import { getUsersOfChat } from "model";
import { extractName } from "utils/extractName";

const removeComposer = new Composer<MyContext>();

removeComposer.command("remove", async (ctx) => {
  const users = getUsersOfChat(ctx.chat.id);
  let keyboard = new InlineKeyboard();
  users.forEach(({ name }, index) => {
    if (name) {
      keyboard = keyboard.text(`${extractName(name)} ❌`, `removeUser ${name}`);
    }
    if ((index + 1) % 2 === 0) {
      keyboard = keyboard.row();
    }
  });
  await ctx.reply("Выберите участника, которого надо исключить", {
    reply_markup: keyboard,
  });
});

export { removeComposer };
