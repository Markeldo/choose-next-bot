export const extractName = (inputString: string) => {
  if (inputString.startsWith("@")) {
    return inputString.replace("@", "");
  }

  const regex = /\[(.*?)\]/; // регулярное выражение для захвата текста внутри квадратных скобок
  const match = inputString.match(regex);
  return match ? match[1] : null; // возвращаем найденное имя или null, если не найдено
};
