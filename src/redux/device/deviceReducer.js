import { DEVICE_SET } from "./deviceTypes";

const initialState = {
  isMobile: false,
};

const deviceReducer = (state = initialState, action) => {
  switch (action.type) {
    case DEVICE_SET:
      return {
        isMobile: action.payload,
      };
    default:
      return state;
  }
};

export default deviceReducer;
