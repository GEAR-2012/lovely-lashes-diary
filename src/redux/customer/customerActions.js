import { CUSTOMERS_REQUEST_STARTED, CUSTOMERS_FAILURE, LISTEN_CUSTOMERS_SUCCESS } from "./customerTypes";
import { db } from "../../firebase/config";
import { addDoc, collection, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";

const unixTimestamp = Date.now();

export const customersRequestStarted = () => {
  return {
    type: CUSTOMERS_REQUEST_STARTED,
  };
};

export const customersFailure = (error) => {
  return {
    type: CUSTOMERS_FAILURE,
    payload: error,
  };
};

// LISTEN
export const listenToCustomersSuccess = (customers) => {
  return {
    type: LISTEN_CUSTOMERS_SUCCESS,
    payload: customers,
  };
};

// CREATE
export const createCustomer = (customerData) => {
  return (dispatch) => {
    dispatch(customersRequestStarted());
    const addDocToCollection = async () => {
      const collectionRef = collection(db, "customers");
      const docRef = await addDoc(collectionRef, { ...customerData, createdAt: unixTimestamp });
      return docRef;
    };

    try {
      addDocToCollection().catch((error) => dispatch(customersFailure(error)));
    } catch (error) {
      dispatch(customersFailure(error));
    }
  };
};

// UPDATE
export const updateCustomer = (docId, customerData) => {
  return (dispatch) => {
    dispatch(customersRequestStarted());
    const updateDocument = async () => {
      const documentRef = doc(db, "customers", docId);
      const updatedDoc = {
        name: customerData.name,
        phone: customerData.phone,
        memo: customerData.memo,
        updatedAt: unixTimestamp,
      };
      const docRef = await updateDoc(documentRef, updatedDoc);
      return docRef;
    };

    try {
      updateDocument().catch((error) => dispatch(customersFailure(error)));
    } catch (error) {
      dispatch(customersFailure(error));
    }
  };
};

// DELETE
export const deleteCustomer = (id) => {
  return (dispatch) => {
    dispatch(customersRequestStarted());

    const deleteDocument = async (id) => {
      const docRef = doc(db, "customers", id);
      const prom = await deleteDoc(docRef);
      return prom;
    };

    try {
      deleteDocument(id).catch((error) => dispatch(customersFailure(error)));
    } catch (error) {
      dispatch(customersFailure(error));
    }
  };
};
