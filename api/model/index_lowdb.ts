import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import { Data, User } from "../types";
export * from "./constants";

import jsonfile from "jsonfile";

const file = "./api/model/db.json";

const defaultData = { users: [] };
let db: Low<Data>;
async function initDB() {
  return await JSONFilePreset<Data>(file, defaultData);
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

const users = jsonfile.readFileSync(file).users;
console.log(users);
