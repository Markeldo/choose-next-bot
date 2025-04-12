import { Composer } from "grammy";
import { getUsersOfChat } from "../model";
import { extractName } from "utils/extractName";

const composer = new Composer();

composer.command(["list"], async (ctx) => {
  const result = getUsersOfChat(ctx.chat.id)
    .map(
      ({ name, lastPicked }) =>
        `${extractName(name)}:\t${
          (lastPicked &&
            `${new Date(lastPicked).toDateString()} ${new Date(
              lastPicked
            ).toTimeString()}`) ||
          "никогда"
        }`
    )
    .join("\n");
  ctx.reply(
    "<b>📋 Список участников с датой последнего вызова к доске</b>\n\n" +
      result,
    {
      parse_mode: "HTML",
      message_thread_id: ctx.message?.message_thread_id,
    }
  );
});

export { composer as listComposer };
