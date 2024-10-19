import { Composer, InlineKeyboard } from "grammy";
import { MyContext } from "../types";

const removeUserComposer = new Composer<MyContext>();

removeUserComposer.command("removeUser", async (ctx) => {
  await ctx.reply(
    "Выберите пользователя, которого надо исключить",
    ctx.message
  );
});

export { removeUserComposer };
