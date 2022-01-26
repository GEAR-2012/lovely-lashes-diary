export const timestampToDatetimePickerFormat = (timestamp) => {
  const dateTime = new Date(timestamp);

  const alwaysTwoDigits = (digit) => {
    const len = digit.toFixed().length;
    if (len === 1) {
      return `0${digit}`;
    } else {
      return digit.toFixed();
    }
  };

  const year = dateTime.getFullYear();
  const month = alwaysTwoDigits(dateTime.getMonth() + 1);
  const day = alwaysTwoDigits(dateTime.getDate());
  const hour = alwaysTwoDigits(dateTime.getHours());
  const minute = alwaysTwoDigits(dateTime.getMinutes());

  const formatted = `${year}-${month}-${day}T${hour}:${minute}`;

  return formatted;
};
