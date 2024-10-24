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

export const updateUserById = async (
  id: number,
  chatId: number,
  lastPicked: number
) => {
  const index = db.data.users.findIndex(
    (user) => id === user.id && chatId === user.chatId
  );

  if (index === -1) {
    throw new Error("No user with such id in chatId");
  }
  const user = db.data.users.at(index);
  if (!user) {
    throw new Error("No user with such id in chatId");
  }
  user.lastPicked = lastPicked;

  return await db.write();
};

export const deleteUserInChat = async (id: number, chatId: number) => {
  if (
    db.data.users.findIndex(
      (user) => id === user.id && chatId === user.chatId
    ) === -1
  ) {
    throw new Error("no user found");
  }
  db.data.users = db.data.users.filter(
    (user) => user.id !== id || chatId !== user.chatId
  );

  await db.write();
  return;
};
