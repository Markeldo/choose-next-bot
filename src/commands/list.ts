import { Composer } from "grammy";
import { getUsersOfChat } from "../model";
import { extractName } from "utils/extractName";

const composer = new Composer();

composer.command(["list"], async (ctx) => {
  const result = getUsersOfChat(ctx.chat.id)
    .map(
      ({ name, lastPicked }) =>
        `${extractName(name)}:\t${
          (lastPicked && new Date(lastPicked).toDateString()) || "никогда"
        }`
    )
    .join("\n");
  ctx.reply("*Кто в чате и когда вызывался к доске*\n\n" + result, {
    parse_mode: "MarkdownV2",
  });
});

export { composer as listComposer };
