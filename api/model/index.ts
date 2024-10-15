import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import { Data, User } from "../types";
export * from "./constants";

import jsonfile from "jsonfile";
import { cloneDeep } from "es-toolkit";

const file = "./api/model/db.json";

const defaultData = { users: [] };
/*let db: Low<Data>;
async function initDB() {
  return await JSONFilePreset<Data>(file, defaultData);
}
initDB().then((result) => {
  db = result;
});*/
const db = jsonfile.readFileSync(file) as Data;

export const addUser = async (user: User) => {
  if (
    db.users.find(
      ({ name, chatId }) => name === user.name && chatId === user.chatId
    )
  ) {
    return false;
  }
  db.users.push(user);
  jsonfile.writeFileSync(file, db, { spaces: 2 });
  return true;
};

export const getUsersOfChat = (chatId: number) => {
  return cloneDeep(
    db.users.filter(({ chatId: userChatId }) => userChatId === chatId)
  );
};

export const updateUserByName = (username: string, lastPicked: number) => {
  const index = db.users.findIndex(({ name }) => name === username);

  if (index !== -1) {
    // Заменяем объект
    db.users[index] = { ...db.users[index], lastPicked: lastPicked };
  } else {
    console.log("Объект с таким именем не найден.");
  }
  jsonfile.writeFileSync(file, db, { spaces: 2 });
};

export { db };
