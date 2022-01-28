import { combineReducers } from "redux";
import customerReducer from "./customer/customerReducer";
import appointmentReducer from "./appointment/appointmentReducer";
import alertReducer from "./alert/alertReducer";
import loginModalReducer from "./loginModal/loginModalReducer";
import deleteAppModalReducer from "./deleteAppModal/deleteAppModalReducer";
import userReducer from "./user/userReducer";
import deviceReducer from "./device/deviceReducer";

const rootReducer = combineReducers({
  customer: customerReducer,
  appointment: appointmentReducer,
  alert: alertReducer,
  loginModal: loginModalReducer,
  deleteAppModal: deleteAppModalReducer,
  user: userReducer,
  device: deviceReducer,
});

export default rootReducer;
