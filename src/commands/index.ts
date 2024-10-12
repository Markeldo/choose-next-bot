import { Composer } from "grammy";

import { listComposer } from "./list";
import { addComposer } from "./add";
import { MyContext } from "../types";

const composer = new Composer<MyContext>();

export { composer as commands };

composer.use(listComposer).use(addComposer);
