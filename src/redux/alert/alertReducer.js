import Slide from "@mui/material/Slide";
import { OPEN_ALERT, CLOSE_ALERT } from "./alertTypes";

const SlideTransition = (props) => {
  return <Slide {...props} direction="down" />;
};

const initialState = {
  open: false,
  transition: SlideTransition,
  severity: "success",
  message: "",
};

const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_ALERT:
      return {
        ...state,
        open: true,
        severity: action.payload.severity,
        message: action.payload.message,
      };
    case CLOSE_ALERT:
      return {
        ...state,
        open: false,
        message: "",
      };
    default:
      return state;
  }
};

export default alertReducer;
