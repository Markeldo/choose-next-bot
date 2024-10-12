import { Low } from "lowdb";
import { Data, User } from "../types";
import { JSONFilePreset } from "lowdb/node";
export * from "./constants";

const defaultData = { users: [] };
let db: Low<Data>;
async function initDB() {
  return await JSONFilePreset<Data>("./src/db.json", defaultData);
}
initDB().then((result) => {
  db = result;
});

export const addUser = async (user: User) => {
  if (
    db.data.users.find(
      ({ name, chatId }) => name === user.name && chatId === user.chatId
    )
  ) {
    return false;
  }
  db.data.users.push(user);
  await db.write();
  return true;
};

export const getUsersOfChat = (chatId: number) => {
  return db.data.users.filter(
    ({ chatId: userChatId }) => userChatId === chatId
  );
};

export { db };
