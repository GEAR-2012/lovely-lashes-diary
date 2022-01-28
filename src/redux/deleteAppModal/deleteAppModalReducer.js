import { OPEN_DELETEAPP_MODAL, CLOSE_DELETEAPP_MODAL } from "./deleteAppModalTypes";

const initialState = {
  open: false,
  id: "",
};

const deleteAppModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_DELETEAPP_MODAL:
      return {
        open: true,
        id: action.payload,
      };
    case CLOSE_DELETEAPP_MODAL:
      return {
        open: false,
      };
    default:
      return state;
  }
};

export default deleteAppModalReducer;
