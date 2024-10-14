import { Composer } from "grammy";
import { getUsersOfChat } from "../model";

const composer = new Composer();

composer.command(["list"], async (ctx) => {
  const result = getUsersOfChat(ctx.chat.id)
    .map(
      ({ name, lastPicked }) =>
        `${name.replace("@", "")}:\t${
          (lastPicked && new Date(lastPicked).toDateString()) || "никогда"
        }`
    )
    .join("\n");
  ctx.reply("*Кто в чате и когда вызывался к доске*\n\n" + result, {
    parse_mode: "MarkdownV2",
  });
});

export { composer as listComposer };
