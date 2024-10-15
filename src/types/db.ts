export type User = {
  name: string;
  chatId: number;
  lastPicked?: number;
};

export type Data = {
  users: User[];
};
