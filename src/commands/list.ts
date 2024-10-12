import { Composer } from "grammy";
import { getUsersOfChat } from "../model";

const composer = new Composer();

composer.command(["list"], async (ctx) => {
  const result = getUsersOfChat(ctx.chat.id)
    .map(
      ({ name, lastPicked = "_никогда_" }) =>
        `${name.replace("@", "")}:\t${lastPicked}`
    )
    .join("\n");
  ctx.reply("*Кто в чате и когда вызывался к доске*\n\n" + result, {
    parse_mode: "MarkdownV2",
  });
});

export { composer as listComposer };
