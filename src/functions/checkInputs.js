export const checkName = (name) => {
  if (name.trim().length < 3) return "Please, provide at least 3 character";
  if (name.trim().length > 50) return "This Customer Name is probably too long (max 50 char)";
  return "";
};

export const checkPhone = (phone) => {
  const pattern = /^(?:0?(?:(\+|[00])44)?\d{10,11})$/;
  if (!phone) return "";
  if (pattern.test(phone.trim())) return "";
  return "Please, provide a valid phone number";
};

export const checkIfExists = (data) => {
  if (!data.trim()) return "Pick a valid one";
  return "";
};

export const checkTimeOfAppointment = (time) => {
  if (isNaN(time)) return "Pick a valid date/time";
  return "";
};

export const checkLashLength = (lengths) => {
  if (lengths.length === 0) return "Pick at least one lash length";
  return "";
};

export const checkCurrency = (amount) => {
  if (amount > 150) return "Amount is probably too high";
  if (amount < 0) return "Amount can be only positive number";
  return "";
};

export const checkMemo = (memo) => {
  if (!memo.trim()) return "";
  if (memo.trim().length < 3) return "Customer Memo should consist minimum of 3 characters Or omit";
  if (memo.trim().length > 300) return "This Customer Memo is probably too long (max 300 char)";
};

export const checkEmail = (email) => {
  const pattern =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  if (pattern.test(email.trim())) return "";
  return "Please, provide a valid email address";
};

export const checkPassword = (password) => {
  const pwd = password.trim();
  if (pwd.length < 8) return "Your password needs a minimum of 8 characters";
  if (pwd.search(/[a-z]/) < 0) return "Your password needs a lower case letter";
  if (pwd.search(/[A-Z]/) < 0) return "Your password needs an uppser case letter";
  if (pwd.search(/[0-9]/) < 0) return "Your password needs a number";
  return "";
};
