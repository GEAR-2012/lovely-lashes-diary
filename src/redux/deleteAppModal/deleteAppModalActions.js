import { OPEN_DELETEAPP_MODAL, CLOSE_DELETEAPP_MODAL } from "./deleteAppModalTypes";

export const openDeleteAppModal = (id) => {
  return {
    type: OPEN_DELETEAPP_MODAL,
    payload: id,
  };
};

export const closeDeleteAppModal = () => {
  return {
    type: CLOSE_DELETEAPP_MODAL,
  };
};
