// Функция для валидации учётки Telegram
export const isValidTelegramAccount = (input: string) => {
  const regex = /^@?[a-zA-Z0-9_]{5,32}$/; // Учётка должна содержать от 5 до 32 символов
  return regex.test(input);
};
