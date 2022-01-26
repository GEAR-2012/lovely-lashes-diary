import { DEVICE_SET } from "./deviceTypes";

export const deviceSet = (isMobile) => {
  return {
    type: DEVICE_SET,
    payload: isMobile,
  };
};
