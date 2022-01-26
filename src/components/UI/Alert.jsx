import React from "react";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { connect } from "react-redux";
import { alertClose } from "../../redux";

const Alert = ({ alertData, alertClose }) => {
  return (
    <Snackbar
      open={alertData.open}
      autoHideDuration={6000}
      onClose={alertClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      TransitionComponent={alertData.transition}
    >
      <MuiAlert elevation={6} variant="filled" onClose={alertClose} severity={alertData.severity}>
        {alertData.message}
      </MuiAlert>
    </Snackbar>
  );
};

const mapStateToProps = (state) => {
  return {
    alertData: state.alert,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    alertClose: () => dispatch(alertClose()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Alert);
