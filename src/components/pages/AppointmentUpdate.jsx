import React from "react";
import { connect } from "react-redux";
import { updateAppointment, alertOpen } from "../../redux";
import AppointmentForm from "../forms/AppointmentForm";
import { useParams } from "react-router-dom";

const AppointmentCreate = ({ appointmentData, updateAppointment, alertOpen }) => {
  const { appointmentId } = useParams();

  const updateExisitngAppointment = (inputData) => {
    let result = false;
    // UPDATE AN EXISTING APPOINTMENT
    updateAppointment(appointmentId, inputData);
    // alerts
    if (appointmentData.error) {
      alertOpen({ severity: "error", message: "An error occurred while Appointment saving: " + appointmentData.error });
      result = false;
    } else {
      alertOpen({ severity: "success", message: "The Appointment was updated in the database." });
      result = true;
    }
    return result;
  };

  return (
    <AppointmentForm
      formTitle="Update Appointment Details"
      appointmentId={appointmentId}
      action={updateExisitngAppointment}
      redirect={true}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    appointmentData: state.appointment,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateAppointment: (id, data) => dispatch(updateAppointment(id, data)),
    //
    alertOpen: (data) => dispatch(alertOpen(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentCreate);
