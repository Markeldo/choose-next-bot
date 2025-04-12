export type User = {
  id: number;
  name: string;
  chatId: number;
  lastPicked?: number;
};

export type LogError = {
  createdAt: number;
  errorText: string;
  error: string;
};

export type Data = {
  users: User[];
  errors: LogError[];
};
