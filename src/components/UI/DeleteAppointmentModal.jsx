import React from "react";
import { connect } from "react-redux";
import { Button, Card, CardActions, CardContent, Divider, Fade, Modal, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { closeDeleteAppModal, deleteAppointment, alertOpen } from "../../redux";
import { useNavigate } from "react-router-dom";
import WarningIcon from "@mui/icons-material/Warning";

const useStyles = makeStyles((theme) => ({
  modal: {
    transition: "all 3s",
  },
  card: {
    padding: theme.spacing(1),
    width: 600,
    maxWidth: "90%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  message: {
    fontSize: 36,
    [theme.breakpoints.down("sm")]: {
      fontSize: 28,
    },
  },
  cardActions: {
    flexDirection: "row",
    gap: theme.spacing(2),
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  },
}));

const DeleteAppointmentModal = ({
  deleteAppModalData,
  closeDeleteAppModal,
  deleteAppointment,
  alertOpen,
  appointmentData,
  deviceData,
}) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const isMobile = deviceData.isMobile;

  const handleDeleteAppointment = () => {
    // DELETE AN EXISTING APPOINTMENT
    deleteAppointment(deleteAppModalData.id);
    closeDeleteAppModal();
    // alerts
    if (appointmentData.error) {
      alertOpen({
        severity: "error",
        message: "An error occurred in an attempt to delete this appointment: " + appointmentData.error,
      });
    } else {
      alertOpen({ severity: "success", message: "The Appointment was successfully deleted from the database." });
      navigate("/");
    }
  };

  return (
    <Modal
      className={classes.modal}
      open={deleteAppModalData.open}
      onClose={closeDeleteAppModal}
      aria-labelledby="modal-delete-appointment-register"
      aria-describedby="modal-delete-appointment-register-modal"
    >
      <Fade in={deleteAppModalData.open}>
        <Card elevation={20} className={classes.card}>
          <CardContent>
            <WarningIcon />
            <Typography className={classes.message} variant="h2" gutterBottom>
              Are You Sure You Want to Delete This Appointment?
            </Typography>
            <Divider />
          </CardContent>
          <CardActions disableSpacing className={classes.cardActions}>
            <Button
              disableElevation
              variant="contained"
              fullWidth
              size={isMobile ? "small" : "large"}
              onClick={closeDeleteAppModal}
            >
              Nae
            </Button>
            <Button
              disableElevation
              variant="contained"
              fullWidth
              size={isMobile ? "small" : "large"}
              onClick={handleDeleteAppointment}
              color="error"
            >
              Aye
            </Button>
          </CardActions>
        </Card>
      </Fade>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    deleteAppModalData: state.deleteAppModal,
    appointmentData: state.appointment,
    deviceData: state.device,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // delete app modal
    closeDeleteAppModal: () => dispatch(closeDeleteAppModal()),
    // appointment
    deleteAppointment: (id) => dispatch(deleteAppointment(id)),
    // alert
    alertOpen: (inp) => dispatch(alertOpen(inp)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAppointmentModal);
