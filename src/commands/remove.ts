import { Composer, InlineKeyboard } from "grammy";
import { MyContext } from "../types";
import { getUsersOfChat } from "model";
import { extractName } from "utils/extractName";

const removeComposer = new Composer<MyContext>();

removeComposer.command("remove", async (ctx) => {
  const users = getUsersOfChat(ctx.chat.id);
  let keyboard = new InlineKeyboard();
  users.forEach(({ id, name }, index) => {
    if (id) {
      keyboard = keyboard.text(`${extractName(name)} ❌`, `removeUser ${id}`);
    }
    if ((index + 1) % 2 === 0) {
      keyboard = keyboard.row();
    }
  });
  await ctx.reply("Выберите участника, которого надо исключить", {
    reply_markup: keyboard,
    message_thread_id: ctx.message?.message_thread_id,
  });
});

export { removeComposer };
