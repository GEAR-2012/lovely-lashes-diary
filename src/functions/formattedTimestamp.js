export const formattedTimestamp = (timestamp) => {
  let formatted = "Unknown";
  if (timestamp) {
    const alwaysTwoDigits = (digit) => {
      const len = digit.toFixed().length;
      if (len === 1) {
        return `0${digit}`;
      } else {
        return digit.toFixed();
      }
    };
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = alwaysTwoDigits(date.getMonth() + 1);
    const day = alwaysTwoDigits(date.getDate());
    const hour = alwaysTwoDigits(date.getHours());
    const minute = alwaysTwoDigits(date.getMinutes());

    formatted = `${day}/${month}/${year} ${hour}:${minute}`;
  }
  return formatted;
};
