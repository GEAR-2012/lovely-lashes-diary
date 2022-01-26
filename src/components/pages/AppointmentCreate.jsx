import React from "react";
import { connect } from "react-redux";
import { createAppointment, alertOpen } from "../../redux";
import AppointmentForm from "../forms/AppointmentForm";

const AppointmentCreate = ({ appointmentData, createAppointment, alertOpen }) => {
  const createNewAppointment = (inputData) => {
    let result = false;
    // CREATE A NEW APPOINTMENT
    createAppointment(inputData);
    // alerts
    if (appointmentData.error) {
      alertOpen({ severity: "error", message: "An error occurred while Appointment saving: " + appointmentData.error });
      result = false;
    } else {
      alertOpen({ severity: "success", message: "The Appointment was added to the database." });
      result = true;
    }
    return result;
  };

  return <AppointmentForm formTitle="Create an Appointment" action={createNewAppointment} redirect={false} />;
};

const mapStateToProps = (state) => {
  return {
    appointmentData: state.appointment,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createAppointment: (inpData) => dispatch(createAppointment(inpData)),
    //
    alertOpen: (data) => dispatch(alertOpen(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentCreate);
