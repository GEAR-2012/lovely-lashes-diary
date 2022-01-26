import { OPEN_LOGIN_MODAL, CLOSE_LOGIN_MODAL } from "./loginModalTypes";

const initialState = {
  open: false,
};

const loginModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_LOGIN_MODAL:
      return {
        open: true,
      };
    case CLOSE_LOGIN_MODAL:
      return {
        open: false,
      };
    default:
      return state;
  }
};

export default loginModalReducer;
