import { OPEN_LOGIN_MODAL, CLOSE_LOGIN_MODAL } from "./loginModalTypes";

export const openLoginModal = () => {
  return {
    type: OPEN_LOGIN_MODAL,
  };
};

export const closeLoginModal = () => {
  return {
    type: CLOSE_LOGIN_MODAL,
  };
};
