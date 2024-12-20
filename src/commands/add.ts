import { Composer } from "grammy";
import { MyContext } from "../types";

const addComposer = new Composer<MyContext>();

addComposer.command("add", async (ctx) => {
  ctx.session.expectingAccount = ctx.update.message?.from.id || false;
  await ctx.reply(`Добавить участника`, {
    message_thread_id: ctx.message?.message_thread_id,
  });
});

export { addComposer };
