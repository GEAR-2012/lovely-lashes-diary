import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { connect } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase/config";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Container, CssBaseline, Grid } from "@mui/material";
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
  userSet,
  userUnset,
  customersRequestStarted,
  listenToCustomersSuccess,
  customersFailure,
  appointmentsRequestStarted,
  listenToAppointmentsSuccess,
  appointmentsFailure,
  alertOpen,
  deviceSet,
} from "./redux";
import AppointmentUpdate from "./components/pages/AppointmentUpdate";
import CustomerDetails from "./components/pages/CustomerDetails";
import AppointmentDetails from "./components/pages/AppointmentDetails";
import Statistics from "./components/pages/Statistics";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    darken: "rgba(0, 0, 0, 0.04)",
    primary: { main: "hsl(282, 50%, 55%)" },
    secondary: { main: "hsl(50, 100%, 50%)" },
    error: {
      main: "hsl(10, 100%, 50%)",
    },
    text: {
      primary: "hsl(282, 50%, 25%)",
    },
    background: {
      paper: "hsl(0, 0%, 100%)",
      default: "hsl(0, 0%, 97%)",
    },
  },
  shape: {
    borderRadius: 6,
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    darken: "rgba(0, 0, 0, 0.15)",
    primary: { main: "hsl(201, 49%, 40%)" },
    secondary: { main: "hsl(48, 100%, 50%)" },
    error: {
      main: "hsl(10, 100%, 50%)",
    },
    text: {
      primary: "hsl(50, 100%, 50%)",
    },
    background: {
      paper: "hsl(0, 0%, 5%)",
      default: "hsl(0, 0%, 10%)",
    },
  },
  shape: {
    borderRadius: 6,
  },
});

const App = ({
  userData,
  userSet,
  userUnset,
  customersRequestStarted,
  listenToCustomersSuccess,
  customersFailure,
  appointmentsRequestStarted,
  listenToAppointmentsSuccess,
  appointmentsFailure,
  alertOpen,
  deviceSet,
}) => {
  const [isUserVerified, setIsUserVerified] = useState(false);

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
    setIsUserVerified(userData.user.emailVerified);
  }, [userData]);

  // Listen to auth state change
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        userSet(user);
        alertOpen({
          severity: "success",
          message: "You are successfully logged in.",
        });
      } else {
        userUnset();
        alertOpen({
          severity: "success",
          message: "You are successfully logged out.",
        });
      }
    });
    return unsub;
  }, [alertOpen, userUnset, userSet]);

  // Listen to appointment list change
  useEffect(() => {
    appointmentsRequestStarted();
    const collectionRef = collection(db, "appointments");
    const q = query(collectionRef, orderBy("timeOfAppointment", "asc"));
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
        appointmentsFailure(error);
      }
    );
    return unsub;
  }, [appointmentsFailure, appointmentsRequestStarted, listenToAppointmentsSuccess]);

  // Listen to customer list change
  useEffect(() => {
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
        customersFailure(error);
      }
    );
    return unsub;
  }, [customersFailure, customersRequestStarted, listenToCustomersSuccess]);

  return (
    <ThemeProvider theme={true ? darkTheme : lightTheme}>
      <CssBaseline />
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
              {/* Not Found */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
          <LoginModal />
          <Alert />
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

const mapStateToProps = (state) => {
  return {
    userData: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // auth
    userSet: (inp) => dispatch(userSet(inp)),
    userUnset: () => dispatch(userUnset()),
    // firestore (customers)
    customersRequestStarted: () => dispatch(customersRequestStarted()),
    listenToCustomersSuccess: (inp) => dispatch(listenToCustomersSuccess(inp)),
    customersFailure: (inp) => dispatch(customersFailure(inp)),
    // firestore (appointments)
    appointmentsRequestStarted: () => dispatch(appointmentsRequestStarted()),
    listenToAppointmentsSuccess: (inp) => dispatch(listenToAppointmentsSuccess(inp)),
    appointmentsFailure: (inp) => dispatch(appointmentsFailure(inp)),
    // alert
    alertOpen: (inp) => dispatch(alertOpen(inp)),
    // device
    deviceSet: (inp) => dispatch(deviceSet(inp)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
