import React, { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { connect } from "react-redux";
import { alertOpen, createUser, closeLoginModal } from "../../redux";
import { checkName, checkEmail, checkPassword } from "../../functions";
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

const SignupForm = ({ userData, createUser, alertOpen, closeLoginModal, deviceData }) => {
  const classes = useStyles();
  const isMobile = deviceData.isMobile;

  useEffect(() => {
    if (userData.error) {
      alertOpen({
        severity: "error",
        message: userData.error,
      });
    }
    if (userData.user && userData.verificationSent && !userData.error) {
      alertOpen({
        severity: "info",
        message: "Email verification sent!",
      });

      closeLoginModal();
    }
  }, [userData]);

  const initialInputData = {
    uName: "",
    email: "",
    pwd1: "",
    pwd2: "",
  };

  const initialInputErrData = {
    uName: "",
    email: "",
    pwd1: "",
    pwd2: "",
  };

  const [inputData, setInputData] = useState(initialInputData);
  const [inputErrData, setInputErrData] = useState(initialInputErrData);
  const [isFormValid, setIsFormValid] = useState(false);

  // extra from validation
  const extraFromValidation = () => {
    if (inputData.pwd1 !== inputData.pwd2) {
      alertOpen({
        severity: "warning",
        message: "Passwords doesn't match",
      });
      return false;
    }
    return true;
  };

  // basic form validation
  useEffect(() => {
    if (
      !inputData.uName ||
      !inputData.email ||
      !inputData.pwd1 ||
      !inputData.pwd2 ||
      inputErrData.uName ||
      inputErrData.email ||
      inputErrData.pwd1 ||
      inputErrData.pwd2
    ) {
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }
  }, [inputErrData]);

  const handleSubmit = () => {
    if (isFormValid) {
      if (extraFromValidation()) {
        // do something...
        createUser({ userName: inputData.uName, email: inputData.email, password: inputData.pwd1 });
      }
    } else {
      alertOpen({
        severity: "warning",
        message: "Form doesn't valid yet",
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

    // check for input errors
    switch (name) {
      case "uName":
        setInputErrData((prevState) => ({
          ...prevState,
          [name]: checkName(inputData[name].trim()),
        }));
        break;
      case "email":
        setInputErrData((prevState) => ({
          ...prevState,
          [name]: checkEmail(inputData[name].trim()),
        }));
        break;
      case "pwd1":
        setInputErrData((prevState) => ({
          ...prevState,
          [name]: checkPassword(inputData[name].trim()),
        }));
        break;
      case "pwd2":
        setInputErrData((prevState) => ({
          ...prevState,
          [name]: checkPassword(inputData[name].trim()),
        }));
        break;
      default:
        setInputErrData((prevState) => ({ ...prevState }));
    }
  };

  return (
    <Box className={classes.container}>
      <TextField
        size={isMobile ? "small" : "medium"}
        error={!!inputErrData.uName}
        required
        variant="outlined"
        type="text"
        name="uName"
        label="User Name"
        value={inputData.uName}
        onChange={handleChange}
        onBlur={handleBlur}
        fullWidth
        helperText={inputErrData.uName}
      />
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
        onBlur={handleBlur}
        fullWidth
        helperText={inputErrData.email}
      />
      <TextField
        size={isMobile ? "small" : "medium"}
        error={!!inputErrData.pwd1}
        required
        variant="outlined"
        type="password"
        name="pwd1"
        label="Password"
        value={inputData.pwd1}
        onChange={handleChange}
        onBlur={handleBlur}
        fullWidth
        helperText={inputErrData.pwd1}
      />
      <TextField
        size={isMobile ? "small" : "medium"}
        error={!!inputErrData.pwd2}
        required
        variant="outlined"
        type="password"
        name="pwd2"
        label="Confirm Password"
        value={inputData.pwd2}
        onChange={handleChange}
        onBlur={handleBlur}
        fullWidth
        helperText={inputErrData.pwd2}
      />
      <Button
        disabled={userData.loading}
        variant="contained"
        size={isMobile ? "medium" : "large"}
        onClick={handleSubmit}
        className={classes.btn}
      >
        Signup
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
    createUser: (inp) => dispatch(createUser(inp)),
    //
    alertOpen: (inp) => dispatch(alertOpen(inp)),
    //
    closeLoginModal: () => dispatch(closeLoginModal()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignupForm);
