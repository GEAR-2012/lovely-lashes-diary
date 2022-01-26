// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6m2RO7wQAoL5tFhXEH5o8zkTDxD-hcws",
  authDomain: "lovely-lashes-appointments.firebaseapp.com",
  projectId: "lovely-lashes-appointments",
  storageBucket: "lovely-lashes-appointments.appspot.com",
  messagingSenderId: "616981326186",
  appId: "1:616981326186:web:402763969d0d39e6391d13",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
