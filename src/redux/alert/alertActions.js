import { OPEN_ALERT, CLOSE_ALERT } from "./alertTypes";

export const alertOpen = (payload) => {
  return {
    type: OPEN_ALERT,
    payload,
  };
};

export const alertClose = () => {
  return {
    type: CLOSE_ALERT,
  };
};
