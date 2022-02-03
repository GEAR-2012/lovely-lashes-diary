import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { connect } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase/config";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Container, Grid } from "@mui/material";
import Alert from "./components/UI/Alert";
import LandingPage from "./components/pages/LandingPage";
import Header from "./components/UI/Header";
import CustomerCreate from "./components/pages/CustomerCreate";
import CustomerUpdate from "./components/pages/CustomerUpdate";
import CustomerList from "./components/pages/CustomerList";
import AppointmentCreate from "./components/pages/AppointmentCreate";
import AppointmentList from "./components/pages/AppointmentList";
import LoginModal from "./components/authentication/LoginModal";
import NotFoundPage from "./components/pages/NotFoundPage";
import {
  userRequestStarted,
  userSet,
  userUnset,
  customersRequestStarted,
  listenToCustomersSuccess,
  customersFailure,
  customersUnload,
  appointmentsRequestStarted,
  listenToAppointmentsSuccess,
  appointmentsFailure,
  appointmentsUnload,
  alertOpen,
  deviceSet,
} from "./redux";
import AppointmentUpdate from "./components/pages/AppointmentUpdate";
import CustomerDetails from "./components/pages/CustomerDetails";
import AppointmentDetails from "./components/pages/AppointmentDetails";
import Statistics from "./components/pages/Statistics";
import DeleteAppointmentModal from "./components/UI/DeleteAppointmentModal";
import RegularCustomers from "./components/pages/RegularCustomers";

const App = ({
  userData,
  userSet,
  userUnset,
  userRequestStarted,
  customersRequestStarted,
  listenToCustomersSuccess,
  customersFailure,
  customersUnload,
  appointmentsRequestStarted,
  listenToAppointmentsSuccess,
  appointmentsFailure,
  appointmentsUnload,
  alertOpen,
  deviceSet,
  customerData,
  appointmentData,
}) => {
  const [isUserVerified, setIsUserVerified] = useState(false);

  // Listen to auth state change
  useEffect(() => {
    userRequestStarted();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        userSet(user);
        alertOpen({
          severity: "success",
          message: "You are successfully logged in.",
        });
      } else {
        userUnset();
        customersUnload();
        appointmentsUnload();
        alertOpen({
          severity: "success",
          message: "You are successfully logged out.",
        });
      }
    });
    return unsub;
  }, [alertOpen, userUnset, userSet, userRequestStarted, customersUnload, appointmentsUnload]);

  // Listen to customer list change
  useEffect(() => {
    if (isUserVerified) {
      customersRequestStarted();
      const collectionRef = collection(db, "customers");
      const q = query(collectionRef, orderBy("name", "asc"));
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const customers = [];
          snapshot.forEach((doc) => {
            customers.push({
              ...doc.data(),
              customerId: doc.id,
            });
          });
          listenToCustomersSuccess(customers);
        },

        (error) => {
          customersFailure(error.message);
        }
      );
      return unsub;
    }
  }, [isUserVerified, customersFailure, customersRequestStarted, listenToCustomersSuccess]);

  // Listen to appointment list change
  useEffect(() => {
    if (isUserVerified) {
      appointmentsRequestStarted();
      const collectionRef = collection(db, "appointments");
      const q = query(collectionRef, orderBy("timeOfAppointment", "desc"));
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const appointments = [];
          snapshot.forEach((doc) => {
            appointments.push({
              appointmentId: doc.id,
              ...doc.data(),
            });
          });
          listenToAppointmentsSuccess(appointments);
        },

        (error) => {
          appointmentsFailure(error.message);
        }
      );
      return unsub;
    }
  }, [isUserVerified, appointmentsFailure, appointmentsRequestStarted, listenToAppointmentsSuccess]);

  // get the size of the device screen
  const getDeviceScreenDimensions = () => {
    const deviceScreenWidth = window.innerWidth;
    return deviceScreenWidth <= 600;
  };

  useEffect(() => {
    deviceSet(getDeviceScreenDimensions());
  }, [deviceSet]);

  window.addEventListener("resize", () => {
    deviceSet(getDeviceScreenDimensions());
  });

  // get if the current user is verified or not
  useEffect(() => {
    const isEmailVerified = userData.user.emailVerified;
    const userName = userData.user.displayName;
    if (isEmailVerified && userName === "Lovely Lashes") {
      setIsUserVerified(true);
    } else {
      setIsUserVerified(false);
    }
  }, [userData]);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={6} sx={{ mb: 10 }}>
        <BrowserRouter>
          <Header />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            {/* Private Routes */}
            <Route
              path="/customer_details/:customerId"
              element={isUserVerified ? <CustomerDetails /> : <LandingPage />}
            />
            <Route path="/customer_create" element={isUserVerified ? <CustomerCreate /> : <LandingPage />} />
            <Route
              path="/customer_update/:customerId"
              element={isUserVerified ? <CustomerUpdate /> : <LandingPage />}
            />
            <Route
              path="/appointment_details/:appointmentId"
              element={isUserVerified ? <AppointmentDetails /> : <LandingPage />}
            />
            <Route path="/appointment_create" element={isUserVerified ? <AppointmentCreate /> : <LandingPage />} />
            <Route
              path="/appointment_update/:appointmentId"
              element={isUserVerified ? <AppointmentUpdate /> : <LandingPage />}
            />
            <Route path="/appointment_list" element={isUserVerified ? <AppointmentList /> : <LandingPage />} />
            <Route path="/customer_list" element={isUserVerified ? <CustomerList /> : <LandingPage />} />
            <Route path="/statistics" element={isUserVerified ? <Statistics /> : <LandingPage />} />
            <Route path="regular_customers" element={isUserVerified ? <RegularCustomers /> : <LandingPage />} />
            {/* Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <DeleteAppointmentModal />
          <LoginModal />
        </BrowserRouter>
        <Alert />
      </Grid>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    userData: state.user,
    customerData: state.customer,
    appointmentData: state.appointment,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // auth
    userRequestStarted: () => dispatch(userRequestStarted()),
    userSet: (inp) => dispatch(userSet(inp)),
    userUnset: () => dispatch(userUnset()),
    // firestore (customers)
    customersRequestStarted: () => dispatch(customersRequestStarted()),
    listenToCustomersSuccess: (inp) => dispatch(listenToCustomersSuccess(inp)),
    customersFailure: (inp) => dispatch(customersFailure(inp)),
    customersUnload: () => dispatch(customersUnload()),
    // firestore (appointments)
    appointmentsRequestStarted: () => dispatch(appointmentsRequestStarted()),
    listenToAppointmentsSuccess: (inp) => dispatch(listenToAppointmentsSuccess(inp)),
    appointmentsFailure: (inp) => dispatch(appointmentsFailure(inp)),
    appointmentsUnload: (inp) => dispatch(appointmentsUnload(inp)),
    // alert
    alertOpen: (inp) => dispatch(alertOpen(inp)),
    // device
    deviceSet: (inp) => dispatch(deviceSet(inp)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
