import React, { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { connect } from "react-redux";
import { alertOpen, loginUser, closeLoginModal } from "../../redux";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(3),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(2),
      gap: theme.spacing(2),
      marginTop: theme.spacing(3),
    },
  },
  btn: {
    marginTop: theme.spacing(3),
    [theme.breakpoints.down("md")]: {
      marginTop: theme.spacing(2),
    },
  },
}));

const LoginForm = ({ userData, alertOpen, loginUser, closeLoginModal, deviceData }) => {
  const classes = useStyles();
  const isMobile = deviceData.isMobile;

  useEffect(() => {
    if (userData.error) {
      alertOpen({
        severity: "error",
        message: userData.error,
      });
    }
    if (userData.user && !userData.error) {
      closeLoginModal();
    }
  }, [userData, alertOpen, closeLoginModal]);

  const initialInputData = {
    email: "",
    pwd: "",
  };

  const initialInputErrData = {
    email: "",
    pwd: "",
  };

  const [inputData, setInputData] = useState(initialInputData);
  const [inputErrData, setInputErrData] = useState(initialInputErrData);
  const [isFormValid, setIsFormValid] = useState(false);

  // basic form validation
  useEffect(() => {
    if (!inputData.email || !inputData.pwd || inputErrData.email || inputErrData.pwd) {
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }
  }, [inputErrData, inputData.email, inputData.pwd]);

  const handleSubmit = () => {
    if (isFormValid) {
      // do something...
      loginUser({ email: inputData.email, password: inputData.pwd });
    } else {
      alertOpen({
        severity: "warning",
        message: "Form isn't valid yet",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // reset the corresponding error state
    setInputErrData((prevState) => ({
      ...prevState,
      [name]: "",
    }));

    // change input state
    setInputData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBlur = (e) => {
    const name = e.target.name;
    setInputData((prevState) => ({
      ...prevState,
      [name]: inputData[name].trim(),
    }));

    // check if the field is filled
    if (!inputData[name].trim()) {
      setInputErrData((prevState) => ({
        ...prevState,
        [name]: "Please provide the required data",
      }));
    }
  };

  return (
    <Box className={classes.container}>
      <TextField
        size={isMobile ? "small" : "medium"}
        error={!!inputErrData.email}
        required
        variant="outlined"
        type="email"
        name="email"
        label="Email"
        value={inputData.email}
        onChange={handleChange}
        // onBlur={handleBlur}
        fullWidth
        helperText={inputErrData.email}
      />
      <TextField
        size={isMobile ? "small" : "medium"}
        error={!!inputErrData.pwd}
        required
        variant="outlined"
        type="password"
        name="pwd"
        label="Password"
        value={inputData.pwd}
        onChange={handleChange}
        onBlur={handleBlur}
        fullWidth
        helperText={inputErrData.pwd}
      />
      <Button
        disabled={userData.loading}
        variant="contained"
        size={isMobile ? "medium" : "large"}
        onClick={handleSubmit}
        className={classes.btn}
      >
        Login
      </Button>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    userData: state.user,
    deviceData: state.device,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    alertOpen: (inp) => dispatch(alertOpen(inp)),
    //
    loginUser: (inp) => dispatch(loginUser(inp)),
    //
    closeLoginModal: () => dispatch(closeLoginModal()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
