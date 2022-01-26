import React, { useEffect, useState } from "react";
import { Button, Grid, Paper, Typography } from "@mui/material";
import CombiTextfield from "../formComponents/CombiTextfield";
import { makeStyles } from "@mui/styles";
import { alertOpen } from "../../redux";
import { connect } from "react-redux";
import { checkName, checkPhone, checkMemo } from "../../functions";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  formTitle: {
    marginBottom: "2rem",
    [theme.breakpoints.down("md")]: {
      fontSize: "2rem",
      textAlign: "center",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.5rem",
      textAlign: "center",
    },
  },
}));

const CustomerForm = ({ formTitle, inputs, action, redirect, alertOpen, deviceData }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const isMobile = deviceData.isMobile;

  const initInputData = {
    name: "",
    phone: "",
    memo: "",
  };

  const initInputErrData = {
    name: "",
    phone: "",
    memo: "",
  };

  const [inputData, setInputData] = useState(initInputData);
  const [inputErrData, setInputErrData] = useState(initInputErrData);
  const [isFormValid, setIsFormValid] = useState(false);

  // pre-fill the form if inputs exist
  useEffect(() => {
    if (inputs) {
      setInputData(inputs);
    }
  }, []);

  // set form validity
  useEffect(() => {
    if (!inputData.name || inputErrData.name || inputErrData.phone || inputErrData.memo) {
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }
  }, [inputData, inputErrData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputErrData((prevState) => {
      return {
        ...prevState,
        [name]: "",
      };
    });
    setInputData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleInputBlur = (e) => {
    const name = e.target.name;
    // Check input datas
    switch (name) {
      case "name":
        setInputErrData((prevState) => ({
          ...prevState,
          name: checkName(inputData.name),
        }));
        break;
      case "phone":
        setInputErrData((prevState) => ({
          ...prevState,
          phone: checkPhone(inputData.phone),
        }));
        break;
      case "memo":
        setInputErrData((prevState) => ({
          ...prevState,
          memo: checkMemo(inputData.memo),
        }));
        break;
      default:
        setInputErrData((prevState) => prevState);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      // do something ...
      const actionResult = action(inputData);
      // if the action was success
      if (actionResult) {
        // reset local states
        setInputData(initInputData);
        setInputErrData(initInputErrData);
        // redirect if required
        if (redirect) navigate("/");
      }
    } else {
      alertOpen({ severity: "warning", message: "The form is not valid yet" });
    }
  };

  return (
    <Grid item xs={12} md={8} lg={6} xl={5}>
      <Paper sx={{ padding: "1.6rem" }} elevation={4}>
        <Typography variant="h4" className={classes.formTitle}>
          {formTitle}
        </Typography>
        <form autoComplete="off" onSubmit={handleSubmit} className={classes.form}>
          {/* Customer Name */}
          <CombiTextfield
            size={isMobile ? "small" : "medium"}
            label="Customer Name"
            name="name"
            value={inputData.name}
            error={inputErrData.name}
            handleChange={handleInputChange}
            handleBlur={handleInputBlur}
            required={true}
          />

          {/* Customer Phone number */}
          <CombiTextfield
            size={isMobile ? "small" : "medium"}
            label="Customer Phone number"
            name="phone"
            value={inputData.phone}
            error={inputErrData.phone}
            handleChange={handleInputChange}
            handleBlur={handleInputBlur}
          />

          {/* Memo of Customer */}
          <CombiTextfield
            size={isMobile ? "small" : "medium"}
            label="Memo of Customer"
            name="memo"
            value={inputData.memo}
            error={inputErrData.memo}
            handleChange={handleInputChange}
            handleBlur={handleInputBlur}
            multiline={true}
          />

          <Button type="submit" variant="contained" size={isMobile ? "small" : "large"}>
            {formTitle}
          </Button>
        </form>
      </Paper>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    deviceData: state.device,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    alertOpen: (data) => dispatch(alertOpen(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerForm);
