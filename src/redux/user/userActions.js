import { USER_REQUEST_STARTED, USER_SET, USER_UNSET, USER_FAILURE, USER_VERIFICATION_SENT } from "./userTypes";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase/config";

export const userSet = (user) => {
  return {
    type: USER_SET,
    payload: user,
  };
};

export const userUnset = (user) => {
  return {
    type: USER_UNSET,
    payload: user,
  };
};

export const userRequestStarted = () => {
  return {
    type: USER_REQUEST_STARTED,
  };
};

export const userFailure = (error) => {
  return {
    type: USER_FAILURE,
    payload: error,
  };
};

export const userVerificationSent = () => {
  return {
    type: USER_VERIFICATION_SENT,
  };
};

// CREATE
export const createUser = ({ userName, email, password }) => {
  return (dispatch) => {
    dispatch(userRequestStarted());
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        sendEmailVerification(userCredentials.user).then(() => {
          dispatch(userVerificationSent());
        });
        updateProfile(userCredentials.user, { displayName: userName });
      })
      .catch((error) => {
        dispatch(userFailure(error.message));
      });
  };
};

// LOGIN
export const loginUser = ({ email, password }) => {
  return (dispatch) => {
    dispatch(userRequestStarted());
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      dispatch(userFailure(error.message));
    });
  };
};

// LOGOUT
export const logoutUser = () => {
  return (dispatch) => {
    dispatch(userRequestStarted());
    signOut(auth).catch((error) => {
      dispatch(userFailure(error.message));
    });
  };
};
