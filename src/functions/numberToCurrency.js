export const numberToCurrency = (num) => {
  num = parseFloat(num);
  if (isNaN(num)) return 0;
  return parseFloat(num.toFixed(2));
};
