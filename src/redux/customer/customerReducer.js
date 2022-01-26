import { CUSTOMERS_REQUEST_STARTED, CUSTOMERS_FAILURE, LISTEN_CUSTOMERS_SUCCESS } from "./customerTypes";

const initialState = {
  loading: false,
  customers: [],
  error: "",
};

const customersReducer = (state = initialState, action) => {
  switch (action.type) {
    case CUSTOMERS_REQUEST_STARTED:
      return {
        ...state,
        loading: true,
      };
    case CUSTOMERS_FAILURE:
      return {
        ...state,
        loading: false,
        customers: [],
        error: action.payload,
      };
    case LISTEN_CUSTOMERS_SUCCESS:
      return {
        ...state,
        loading: false,
        customers: action.payload,
        error: "",
      };
    default:
      return state;
  }
};

export default customersReducer;
