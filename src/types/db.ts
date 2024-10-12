export type User = {
  name: string;
  chatId: number;
  lastPicked?: string;
};

export type Data = {
  users: User[];
};
