import React, { useState } from "react";
import { connect } from "react-redux";
import { AppBar, Box, Fade, Modal, Paper, Tab, Tabs } from "@mui/material";
import { closeLoginModal } from "../../redux";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  modal: {
    transition: "all 3s",
  },
  paper: {
    transition: "all 3s",
    width: 500,
    [theme.breakpoints.down("md")]: {
      width: 400,
    },
    [theme.breakpoints.down("sm")]: {
      width: 300,
    },
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  appBar: {
    borderRadius: theme.shape.borderRadius,
  },
}));

const LoginModal = ({ loginModalData, closeLoginModal }) => {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (e, value) => {
    setTabValue(value);
  };

  return (
    <Modal
      className={classes.modal}
      open={loginModalData.open}
      onClose={closeLoginModal}
      aria-labelledby="modal-login-register"
      aria-describedby="modal-login-register-modal"
    >
      <Fade in={loginModalData.open}>
        <Paper className={classes.paper} elevation={24}>
          <AppBar position="static" className={classes.appBar}>
            <Box>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="secondary"
                textColor="inherit"
                variant="fullWidth"
                centered
                aria-label="login-signup"
              >
                <Tab label="Login" />
                <Tab label="Signup" />
              </Tabs>
            </Box>
          </AppBar>
          {tabValue === 0 && <LoginForm />}
          {tabValue === 1 && <SignupForm />}
        </Paper>
      </Fade>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    loginModalData: state.loginModal,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeLoginModal: () => dispatch(closeLoginModal()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);
