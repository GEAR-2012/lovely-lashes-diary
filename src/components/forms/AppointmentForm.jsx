import React, { useEffect, useMemo, useState } from "react";
import ComboBox from "../formComponents/ComboBox";
import MultipleSelect from "../formComponents/MultipleSelect";
import SingleSelect from "../formComponents/SingleSelect";
import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import CombiTextfield from "../formComponents/CombiTextfield";
import Currency from "../formComponents/Currency";
import ProgressCircular from "../UI/ProgressCircular";
import {
  numberToCurrency,
  timestampToDatetimePickerFormat,
  checkIfExists,
  checkTimeOfAppointment,
  checkLashLength,
  checkCurrency,
  checkMemo,
} from "../../functions";
import { makeStyles } from "@mui/styles";
import { connect } from "react-redux";
import { alertOpen } from "../../redux";
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

const AppointmentForm = ({
  formTitle,
  appointmentId,
  action,
  redirect,
  appointmentData,
  customerData,
  alertOpen,
  deviceData,
}) => {
  const classes = useStyles();
  // originally used for the new appointment initial time (depricated)
  // changed to timeOfLastApp
  // const unixTimestamp = useMemo(() => Date.now(), []);
  const navigate = useNavigate();
  const isMobile = deviceData.isMobile;
  const [timeOfLastApp, setTimeOfLastApp] = useState();

  // get the time of the last appointment of all
  useEffect(() => {
    if (appointmentData.appointments.length > 0) {
      // copy appointments
      const sortedAppointments = [...appointmentData.appointments];
      // ...sort by appointment time
      sortedAppointments.sort((a, b) => {
        return b.timeOfAppointment - a.timeOfAppointment;
      });
      // get the last one
      const lastApp = sortedAppointments[0];
      // ...get it's time
      const lastAppTime = lastApp.timeOfAppointment;
      // set into a local state
      setTimeOfLastApp(lastAppTime);
    }
  }, [appointmentData.appointments]);

  // making options for multiple select field
  const options = customerData.customers.map((customer) => {
    return {
      id: customer.customerId,
      name: customer.name,
      phone: customer.phone,
      memo: customer.memo,
    };
  });

  // possible select options
  const appointmentTypes = ["Taster", "Full", "Infill", "Removal", "Tint", "Bottom Lashes"];
  const lashesTypes = [
    "1D Cashmere Glossy",
    "1D Cashmere Matte",
    "2D-3D Volume",
    "3D Volume",
    "Mega Volume",
    "Hybrid",
    "-",
  ];
  const curlTypes = ["J", "B", "C", "D", "CC", "D+", "-"];
  const thicknesses = ["0.05", "0.07", "0.10", "0.15", "0.20", "0.25", "-"];
  const lashLengths = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, "-"];
  const shapes = ["Normal", "Doll-Eye", "Cat-Eye", "Cat-Normal", "-"];
  const eyepadTypes = [
    "Normal Same Time",
    "Normal Separate",
    "Sensitive Same Time",
    "Sensitive Separate",
    "Little Sensitive Separate",
    "Little Sensitive Same Time",
    "-",
  ];

  const initInputData = useMemo(() => {
    return {
      customerId: "",
      elapsedTime: 0,
      timeOfAppointment: timeOfLastApp,
      typeOfAppointment: "",
      typeOfLashes: "",
      curl_1: "",
      thickness_1: "",
      curl_2: "",
      thickness_2: "",
      lashLength: [],
      shape: "",
      eyepad: "",
      payment: 0,
      tips: 0,
      memo: "",
    };
  }, [timeOfLastApp]);

  const initInputErrData = {
    customerId: "",
    elapsedTime: "",
    timeOfAppointment: "",
    typeOfAppointment: "",
    typeOfLashes: "",
    curl_1: "",
    thickness_1: "",
    curl_2: "",
    thickness_2: "",
    lashLength: "",
    shape: "",
    eyepad: "",
    payment: "",
    tips: "",
    memo: "",
  };

  const [idOfAppointmentToUpdate, setIdOfAppointmentToUpdate] = useState("");
  const [inputData, setInputData] = useState(initInputData);
  const [inputErrData, setInputErrData] = useState(initInputErrData);
  const [isFormValid, setIsFormValid] = useState(false);
  const [previousAppointment, setPreviousAppointment] = useState();
  const [isTint, setIsTint] = useState(false); // to disable inputs

  // if user select 'Tint' as type of appointment
  // set all other params to not applied & input fields to disabled
  // otherwise back to normal
  const tintResetParams = useMemo(
    () => ({
      typeOfLashes: inputData.typeOfLashes === "-" ? "" : inputData.typeOfLashes,
      curl_1: inputData.curl_1 === "-" ? "" : inputData.curl_1,
      thickness_1: inputData.thickness_1 === "-" ? "" : inputData.thickness_1,
      curl_2: inputData.curl_2 === "-" ? "" : inputData.curl_2,
      thickness_2: inputData.thickness_2 === "-" ? "" : inputData.thickness_2,
      lashLength: inputData.lashLength[0] === "-" ? [] : inputData.lashLength,
      shape: inputData.shape === "-" ? "" : inputData.shape,
      eyepad: inputData.eyepad === "-" ? "" : inputData.eyepad,
    }),
    [
      inputData.typeOfLashes,
      inputData.curl_1,
      inputData.thickness_1,
      inputData.curl_2,
      inputData.thickness_2,
      inputData.lashLength,
      inputData.shape,
      inputData.eyepad,
    ]
  );

  const notApplicableParams = useMemo(
    () => ({
      typeOfLashes: "-",
      curl_1: "-",
      thickness_1: "-",
      curl_2: "-",
      thickness_2: "-",
      lashLength: ["-"],
      shape: "-",
      eyepad: "-",
    }),
    []
  );

  useEffect(() => {
    const type = inputData.typeOfAppointment;
    console.log(type);

    if (type) {
      if (type === "Tint") {
        // ...do something
        setIsTint(true);
        setInputData((prevState) => {
          return {
            ...prevState,
            ...notApplicableParams,
          };
        });
      } else {
        setIsTint(false);
        setInputData((prevState) => {
          return {
            ...prevState,
            ...tintResetParams,
          };
        });
      }
    }
  }, [inputData.typeOfAppointment, tintResetParams, notApplicableParams]);

  // set appointment id into local state, if given (only in update mode!!!)
  useEffect(() => {
    if (appointmentId) setIdOfAppointmentToUpdate(appointmentId);
  }, [appointmentId]);

  // get all data of an appointment (based on appointmentId) & set it into a local state (only in update mode!!!)
  useEffect(() => {
    if (idOfAppointmentToUpdate) {
      // get only the given customer appointments
      let getAppointmentToUpdate = appointmentData.appointments.filter((app) => {
        return app.appointmentId === idOfAppointmentToUpdate;
      })[0];

      // set up the data object to save into 'inputData' local state and so fill the form
      const appData = {
        customerId: getAppointmentToUpdate.customerId,
        timeOfAppointment: getAppointmentToUpdate.timeOfAppointment,
        elapsedTime: getAppointmentToUpdate.elapsedTime,
        typeOfAppointment: getAppointmentToUpdate.typeOfAppointment,
        typeOfLashes: getAppointmentToUpdate.typeOfLashes,
        curl_1: getAppointmentToUpdate.curl_1,
        curl_2: getAppointmentToUpdate.curl_2,
        thickness_1: getAppointmentToUpdate.thickness_1,
        thickness_2: getAppointmentToUpdate.thickness_2,
        lashLength: getAppointmentToUpdate.lashLength,
        shape: getAppointmentToUpdate.shape,
        eyepad: getAppointmentToUpdate.eyepad,
        payment: getAppointmentToUpdate.payment,
        tips: getAppointmentToUpdate.tips,
        memo: getAppointmentToUpdate.memo,
      };

      // get the appointment & set it into the local state
      setInputData(appData);
    } else {
      // set to initial state
      setInputData(initInputData);
    }
  }, [idOfAppointmentToUpdate, appointmentData.appointments, initInputData]);

  // get all data of last appointment (based on customerId) & set it into a local state
  useEffect(() => {
    if (!appointmentId) {
      if (inputData.customerId) {
        // get only the given customer appointments
        let appointmentsOfCurrentCustomer = appointmentData.appointments.filter((app) => {
          return app.customerId === inputData.customerId;
        });

        // if have any appointment related to the current customer
        // sort it by appointment time and set to be descendent
        if (appointmentsOfCurrentCustomer.length > 0) {
          appointmentsOfCurrentCustomer.sort((a, b) => {
            return b.timeOfAppointment - a.timeOfAppointment;
          });
        }

        // get the last appointment & set it into the local state
        setPreviousAppointment(appointmentsOfCurrentCustomer[0]);
      } else {
        // set to initial state
        setPreviousAppointment(undefined);
        setInputData(initInputData);
      }
    }
  }, [inputData.customerId, appointmentData, appointmentId, initInputData]);

  // pre-fill the form with previous appointmed data if customer Id is given
  // & if there is previous appointment
  useEffect(() => {
    // Calculates the elapsed time & returns it in days
    const getElapsedTime = (prevAppointment) => {
      let elapsedTime = 0;

      const lastAppTime = prevAppointment.timeOfAppointment;

      if (!isNaN(lastAppTime)) {
        elapsedTime = inputData.timeOfAppointment - lastAppTime;
        elapsedTime = Math.round(elapsedTime / 1000 / 60 / 60 / 24);
      }

      return elapsedTime;
    };

    if (!appointmentId) {
      let elapsedTime;
      if (previousAppointment) {
        elapsedTime = getElapsedTime(previousAppointment);
        if (isNaN(elapsedTime)) elapsedTime = "Can not be calculated";
        const typeOfAppointment = previousAppointment.typeOfAppointment;
        const typeOfLashes = previousAppointment.typeOfLashes;
        const curl_1 = previousAppointment.curl_1;
        const thickness_1 = previousAppointment.thickness_1;
        const curl_2 = previousAppointment.curl_2;
        const thickness_2 = previousAppointment.thickness_2;
        const lashLength = previousAppointment.lashLength;
        const shape = previousAppointment.shape;
        const eyepad = previousAppointment.eyepad;
        const payment = previousAppointment.payment;
        const tips = previousAppointment.tips;
        const memo = previousAppointment.memo;

        setInputData((prevState) => ({
          ...prevState,
          elapsedTime,
          typeOfAppointment,
          typeOfLashes,
          curl_1,
          thickness_1,
          curl_2,
          thickness_2,
          lashLength,
          shape,
          eyepad,
          payment,
          tips,
          memo,
        }));
      } else if (!previousAppointment && inputData.customerId) {
        elapsedTime = "first appointment";
        setInputData((prevState) => ({
          ...prevState,
          elapsedTime,
        }));
      }
    }
  }, [previousAppointment, appointmentId, inputData.customerId, inputData.timeOfAppointment]);

  // check for form validity
  useEffect(() => {
    if (
      // there is data
      inputData.customerId &&
      !isNaN(inputData.timeOfAppointment) &&
      inputData.typeOfAppointment &&
      inputData.typeOfLashes &&
      inputData.curl_1 &&
      inputData.thickness_1 &&
      inputData.lashLength.length > 0 &&
      inputData.shape &&
      inputData.eyepad &&
      // there is no error
      !inputErrData.customerId &&
      !inputErrData.curl_1 &&
      !inputErrData.thickness_1 &&
      !inputErrData.curl_2 &&
      !inputErrData.thickness_2 &&
      !inputErrData.timeOfAppointment &&
      !inputErrData.typeOfAppointment &&
      !inputErrData.typeOfLashes &&
      !inputErrData.lashLength &&
      !inputErrData.shape &&
      !inputErrData.eyepad &&
      !inputErrData.payment &&
      !inputErrData.tips &&
      !inputErrData.memo
    ) {
      // if there is data & there is no error
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [inputData, inputErrData]);

  // get the selected values from multiple select input
  const getOptions = (options) => {
    setInputData((prevState) => ({
      ...prevState,
      lashLength: options,
    }));
  };

  // set input data to local state
  const handleInputChange = (e) => {
    const type = e.target.type;
    if (type === "checkbox") {
      const { name, checked } = e.target;
      // reset previous error
      setInputErrData((prevState) => {
        return {
          ...prevState,
          [name]: "",
        };
      });
      setInputData((prevState) => {
        return {
          ...prevState,
          lashLength: {
            ...prevState.lashLength,
            [name]: checked,
          },
        };
      });
    } else if (type === "datetime-local") {
      const { name, value } = e.target;
      // reset previous error
      setInputErrData((prevState) => {
        return {
          ...prevState,
          [name]: "",
        };
      });
      setInputData((prevState) => {
        return {
          ...prevState,
          [name]: Date.parse(value),
        };
      });
    } else {
      const { name, value } = e.target;
      // reset previous error
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
    }
  };

  // error handling
  const handleInputBlur = (e) => {
    const name = e.target.name;
    // Check input datas
    switch (name) {
      case "customerId":
        setInputErrData((prevState) => ({ ...prevState, customerId: checkIfExists(inputData.customerId) }));
        break;
      case "timeOfAppointment":
        setInputErrData((prevState) => ({
          ...prevState,
          timeOfAppointment: checkTimeOfAppointment(inputData.timeOfAppointment),
        }));
        break;
      case "typeOfAppointment":
        setInputErrData((prevState) => ({
          ...prevState,
          typeOfAppointment: checkIfExists(inputData.typeOfAppointment),
        }));
        break;
      case "typeOfLashes":
        setInputErrData((prevState) => ({
          ...prevState,
          typeOfLashes: checkIfExists(inputData.typeOfLashes),
        }));
        break;
      case "curl_1":
        setInputErrData((prevState) => ({
          ...prevState,
          curl_1: checkIfExists(inputData.curl_1),
        }));
        break;
      case "thickness_1":
        setInputErrData((prevState) => ({
          ...prevState,
          thickness_1: checkIfExists(inputData.thickness_1),
        }));
        break;
      case "lashLength":
        const sorted = [...inputData.lashLength];
        sorted.sort((a, b) => a - b);
        setInputData((prevState) => ({ ...prevState, lashLength: sorted }));
        setInputErrData((prevState) => ({
          ...prevState,
          lashLength: checkLashLength(inputData.lashLength),
        }));
        break;
      case "shape":
        setInputErrData((prevState) => ({
          ...prevState,
          shape: checkIfExists(inputData.shape),
        }));
        break;
      case "eyepad":
        setInputErrData((prevState) => ({
          ...prevState,
          eyepad: checkIfExists(inputData.eyepad),
        }));
        break;
      case "payment":
        // change string value to floating
        setInputData((prevState) => ({
          ...prevState,
          payment: numberToCurrency(prevState.payment),
        }));
        setInputErrData((prevState) => ({
          ...prevState,
          payment: checkCurrency(numberToCurrency(inputData.payment)),
        }));
        break;
      case "tips":
        // change string value to floating
        setInputData((prevState) => ({
          ...prevState,
          tips: numberToCurrency(prevState.tips),
        }));
        setInputErrData((prevState) => ({
          ...prevState,
          tips: checkCurrency(numberToCurrency(inputData.tips)),
        }));
        break;
      case "memo":
        setInputErrData((prevState) => ({ ...prevState, memo: checkMemo(inputData.memo) }));
        break;
      default:
        setInputErrData((prevState) => prevState);
    }
  };

  // get customer Id from combo box
  const getInput = (val) => {
    const customerId = val?.id;
    setInputData((prevState) => ({ ...prevState, customerId }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      // create or update appointment document
      const actionResult = action(inputData);
      // if the action was success
      if (actionResult) {
        // reset local states
        setPreviousAppointment(undefined);
        setInputData(initInputData);
        setInputErrData(initInputErrData);
        // redirect if required
        if (redirect) navigate("/");
      }
    } else {
      alertOpen({ severity: "warning", message: "The form is not valid yet" });
    }
  };

  let contentProgress = "";
  if (!timeOfLastApp) {
    contentProgress = <ProgressCircular />;
  }

  let contentForm = "";
  if (inputData && timeOfLastApp) {
    contentForm = (
      <form autoComplete="off" onSubmit={handleSubmit} className={classes.form}>
        {/* Select Customer */}
        <ComboBox
          disabled={!!appointmentId}
          error={inputErrData.customerId}
          handleBlur={handleInputBlur}
          customerId={inputData.customerId}
          options={options}
          getInput={getInput}
          required={true}
        />
        {/* Time of Appointment */}
        <TextField
          disabled={!!appointmentId}
          error={!!inputErrData.timeOfAppointment}
          helperText={inputErrData.timeOfAppointment}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          name="timeOfAppointment"
          size="small"
          id="datetime-local"
          label="Time of Appoinment"
          type="datetime-local"
          value={timestampToDatetimePickerFormat(inputData.timeOfAppointment)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        {/* Elapsed Time */}
        <TextField
          disabled
          fullWidth
          variant="outlined"
          size="small"
          type="text"
          label="Time elapsed since the last appointment (days)"
          name="elapsedTime"
          value={inputData.elapsedTime}
        />
        {/* Type of Appointment */}
        <SingleSelect
          error={inputErrData.typeOfAppointment}
          label="Type of Appointment"
          name="typeOfAppointment"
          value={inputData.typeOfAppointment}
          options={appointmentTypes}
          handleChange={handleInputChange}
          handleBlur={handleInputBlur}
          required={true}
        />
        {/* Type of Lashes */}
        <SingleSelect
          disabled={isTint}
          error={inputErrData.typeOfLashes}
          label="Type of Lashes"
          name="typeOfLashes"
          value={inputData.typeOfLashes}
          options={lashesTypes}
          handleChange={handleInputChange}
          handleBlur={handleInputBlur}
          required={true}
        />
        {/* Curl 1 */}
        <SingleSelect
          disabled={isTint}
          error={inputErrData.curl_1}
          label="Curl of Lashes 1"
          name="curl_1"
          value={inputData.curl_1}
          options={curlTypes}
          handleChange={handleInputChange}
          handleBlur={handleInputBlur}
          required={true}
        />
        {/* Thickness 1 */}
        <SingleSelect
          disabled={isTint}
          error={inputErrData.thickness_1}
          label="Thickness of Lashes 1"
          name="thickness_1"
          value={inputData.thickness_1}
          options={thicknesses}
          handleChange={handleInputChange}
          handleBlur={handleInputBlur}
          required={true}
        />
        {/* Curl 2 */}
        <SingleSelect
          disabled={isTint}
          error={inputErrData.curl_2}
          label="Curl of Lashes 2"
          name="curl_2"
          value={inputData.curl_2}
          options={curlTypes}
          handleChange={handleInputChange}
          handleBlur={handleInputBlur}
          required={false}
        />
        {/* Thickness 2 */}
        <SingleSelect
          disabled={isTint}
          error={inputErrData.thickness_2}
          label="Thickness of Lashes 2"
          name="thickness_2"
          value={inputData.thickness_2}
          options={thicknesses}
          handleChange={handleInputChange}
          handleBlur={handleInputBlur}
          required={false}
        />
        {/* Lash Length */}
        <MultipleSelect
          disabled={isTint}
          error={inputErrData.lashLength}
          initValue={inputData.lashLength}
          name="lashLength"
          label="Lengths of Lashes"
          options={lashLengths}
          size="small"
          getOptions={getOptions}
          handleBlur={handleInputBlur}
          required={true}
        />
        {/* Shape */}
        <SingleSelect
          disabled={isTint}
          error={inputErrData.shape}
          label="Shape of Lashes"
          name="shape"
          value={inputData.shape}
          options={shapes}
          handleChange={handleInputChange}
          handleBlur={handleInputBlur}
          required={true}
        />
        {/* Pad */}
        <SingleSelect
          disabled={isTint}
          error={inputErrData.eyepad}
          label="Eye Pad usage"
          name="eyepad"
          value={inputData.eyepad}
          options={eyepadTypes}
          handleChange={handleInputChange}
          handleBlur={handleInputBlur}
          required={true}
        />
        {/* Payment */}
        <Currency
          error={inputErrData.payment}
          label="Payment"
          name="payment"
          value={inputData.payment}
          handleChange={handleInputChange}
          handleBlur={handleInputBlur}
          symbol="£"
          required={true}
        />
        {/* Tips */}
        <Currency
          error={inputErrData.tips}
          label="Tips"
          name="tips"
          value={inputData.tips}
          handleChange={handleInputChange}
          handleBlur={handleInputBlur}
          symbol="£"
        />
        {/* Memo */}
        <CombiTextfield
          size="small"
          error={inputErrData.memo}
          label="Memo of Appointment"
          name="memo"
          value={inputData.memo}
          handleChange={handleInputChange}
          handleBlur={handleInputBlur}
          multiline={true}
        />
        <Button type="submit" variant="contained" size={isMobile ? "small" : "large"}>
          {formTitle}
        </Button>
      </form>
    );
  }

  return (
    <Grid item xs={12} md={8} lg={6}>
      <Paper sx={{ padding: "1.6rem" }} elevation={4}>
        <Typography variant="h4" className={classes.formTitle}>
          {formTitle}
        </Typography>
        {contentProgress}
        {contentForm}
      </Paper>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    customerData: state.customer,
    appointmentData: state.appointment,
    deviceData: state.device,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    alertOpen: (data) => dispatch(alertOpen(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentForm);
