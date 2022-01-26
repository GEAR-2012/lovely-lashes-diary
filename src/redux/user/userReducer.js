import { USER_REQUEST_STARTED, USER_SET, USER_UNSET, USER_FAILURE, USER_VERIFICATION_SENT } from "./userTypes";

const initialState = {
  loading: false,
  user: "",
  error: "",
  verificationSent: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_REQUEST_STARTED:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case USER_SET:
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: "",
      };
    case USER_UNSET:
      return {
        ...state,
        loading: false,
        user: "",
        error: "",
      };
    case USER_FAILURE:
      return {
        ...state,
        loading: false,
        user: "",
        error: action.payload,
      };
    case USER_VERIFICATION_SENT:
      return {
        ...state,
        verificationSent: true,
      };
    default:
      return state;
  }
};

export default userReducer;
