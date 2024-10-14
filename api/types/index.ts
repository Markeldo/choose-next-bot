export * from "./db";
import { Context, SessionFlavor } from "grammy";

export type SessionData = {
  expectingAccount: string | number | false;
};
// Мы расширяем базовый контекст с помощью SessionFlavor
export type MyContext = Context & SessionFlavor<SessionData>;
