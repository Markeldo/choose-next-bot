import { Composer } from "grammy";

import { listComposer } from "./list";
import { addComposer } from "./add";
import { MyContext } from "../types";
import { addSelfComposer } from "./addSelf";
import { nextComposer } from "./next";

const composer = new Composer<MyContext>();

export { composer as commands };

composer
  .use(listComposer)
  .use(addComposer)
  .use(addSelfComposer)
  .use(nextComposer);
