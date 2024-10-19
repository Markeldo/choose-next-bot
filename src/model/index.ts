import { Low } from "lowdb";
import { Data, User } from "../types";
import { JSONFilePreset } from "lowdb/node";
import { cloneDeep } from "es-toolkit";
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
  return cloneDeep(
    db.data.users.filter(({ chatId: userChatId }) => userChatId === chatId)
  );
};

export const updateUserByName = async (name: string, lastPicked: number) => {
  const index = db.data.users.findIndex((user) => name === user.name);
  db.data.users[index].lastPicked = lastPicked;
  await db.write();
  return;
};

export const deleteUserByName = async (name: string) => {
  db.data.users = db.data.users.filter((user) => user.name !== name);
  await db.write();
  return;
};

export { db };
