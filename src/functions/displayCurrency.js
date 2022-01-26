export const displayCurrency = (num, sign) => {
  const mod = num % 1;
  const partLeft = Math.floor(num).toString();
  const partRight = Math.round(mod * 100) || "00";
  const result = partLeft.concat(".", partRight);

  return `${sign} ${result}`;
};
