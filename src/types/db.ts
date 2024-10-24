export type User = {
  id: number;
  name: string;
  chatId: number;
  lastPicked?: number;
};

export type Data = {
  users: User[];
};
