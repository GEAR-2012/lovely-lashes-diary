import {
  APPOINTMENTS_REQUEST_STARTED,
  APPOINTMENTS_FAILURE,
  LISTEN_APPOINTMENTS_SUCCESS,
  APPOINTMENTS_UNLOAD,
} from "./appointmentTypes";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const unixTimestamp = Date.now();

export const appointmentsUnload = () => {
  return {
    type: APPOINTMENTS_UNLOAD,
  };
};

export const appointmentsRequestStarted = () => {
  return {
    type: APPOINTMENTS_REQUEST_STARTED,
  };
};

export const appointmentsFailure = (error) => {
  return {
    type: APPOINTMENTS_FAILURE,
    payload: error,
  };
};

// LISTEN
export const listenToAppointmentsSuccess = (appointments) => {
  return {
    type: LISTEN_APPOINTMENTS_SUCCESS,
    payload: appointments,
  };
};

// CREATE
export const createAppointment = (appointmentData) => {
  return (dispatch) => {
    dispatch(appointmentsRequestStarted());
    const addDocToCollection = async () => {
      const collectionRef = collection(db, "appointments");
      const docRef = await addDoc(collectionRef, { ...appointmentData, createdAt: unixTimestamp });
      return docRef;
    };

    try {
      addDocToCollection().catch((error) => dispatch(appointmentsFailure(error)));
    } catch (error) {
      dispatch(appointmentsFailure(error));
    }
  };
};

// UPDATE
export const updateAppointment = (docId, appointmentData) => {
  return (dispatch) => {
    dispatch(appointmentsRequestStarted());
    const updateDocument = async () => {
      const documentRef = doc(db, "appointments", docId);
      const docRef = await updateDoc(documentRef, { ...appointmentData, updatedAt: unixTimestamp });
      return docRef;
    };

    try {
      updateDocument().catch((error) => dispatch(appointmentsFailure(error)));
    } catch (error) {
      dispatch(appointmentsFailure(error));
    }
  };
};

// DELETE
export const deleteAppointment = (docId) => {
  return (dispatch) => {
    dispatch(appointmentsRequestStarted());
    const deleteDocument = async () => {
      const documentRef = doc(db, "appointments", docId);
      const docRef = await deleteDoc(documentRef);
      return docRef;
    };

    try {
      deleteDocument().catch((error) => dispatch(appointmentsFailure(error)));
    } catch (error) {
      dispatch(appointmentsFailure(error));
    }
  };
};
