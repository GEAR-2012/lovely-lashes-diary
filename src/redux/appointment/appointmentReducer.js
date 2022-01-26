import { APPOINTMENTS_REQUEST_STARTED, APPOINTMENTS_FAILURE, LISTEN_APPOINTMENTS_SUCCESS } from "./appointmentTypes";

const initialState = {
  loading: false,
  appointments: [],
  error: "",
};

const appointmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case APPOINTMENTS_REQUEST_STARTED:
      return {
        ...state,
        loading: true,
      };
    case LISTEN_APPOINTMENTS_SUCCESS:
      return {
        loading: false,
        appointments: action.payload,
        error: "",
      };
    case APPOINTMENTS_FAILURE:
      return {
        loading: false,
        appointments: [],
        error: action.payload,
      };
    default:
      return state;
  }
};

export default appointmentReducer;
