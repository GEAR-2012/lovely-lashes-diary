import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@mui/styles";
import { Box, Grid, Slider, Typography } from "@mui/material";
import ProgressCircular from "../UI/ProgressCircular";
import CustomDataGrid from "../UI/CustomDataGrid";

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down("md")]: {
      fontSize: "1.8rem",
      fontWeight: 100,
    },
  },
  errors: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },
  error: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
  },
  controls: {
    margin: "2rem 0",
    width: "20rem",
  },
}));

const RegularCustomers = ({ appointmentData, customerData }) => {
  const classes = useStyles();
  const [appointments, setAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loyalCustomers, setLoyalCustomers] = useState([]);
  const [activeMonths, setActiveMonths] = useState([6]);

  // get appointments & customers from redux state into local state
  useEffect(() => {
    if (appointmentData.appointments.length > 0) {
      setAppointments(appointmentData.appointments);
    }
    if (customerData.customers.length > 0) {
      setCustomers(customerData.customers);
    }
  }, [appointmentData.appointments, customerData.customers]);

  // making a new customer array based on activity and bought service
  useEffect(() => {
    if (appointments.length > 0 && customers.length > 0) {
      // loop customers
      const loyalCustomers = [];
      customers.forEach((customer) => {
        let loyaltyPoints = 0; // loyalty points
        let appsInInterval = 0; // appointments points
        const now = new Date().getTime();
        // loop appointments
        appointments.forEach((appointment) => {
          // outer loop's customer's appointments
          if (appointment.customerId === customer.customerId) {
            // Calculate how many appointments the customer have in the last few months, to determine if the customer active or not.
            const criteria = (365 / 12) * activeMonths; // treshold in days
            const appTime = appointment.timeOfAppointment;
            const elapsedTime = now - appTime; // millisec
            const elapsedDays = elapsedTime / 1000 / 60 / 60 / 24;
            // if this appointment was not later than the criteria then customer get 1 'appsInInterval' point
            if (elapsedDays < criteria) {
              appsInInterval += 1;
            }
            //
            // based on appointment type customer gain loyalty points
            const appType = appointment.typeOfAppointment;
            switch (appType) {
              case "Tint":
              case "Removal":
              case "Bottom Lashes":
                loyaltyPoints += 1;
                break;
              case "Taster":
              case "Infill":
                loyaltyPoints += 2;
                break;
              case "Full":
                loyaltyPoints += 3;
                break;
              default:
                loyaltyPoints += 0;
            }
          }
        });

        // decide if the customer have enough appointments in an interval
        if (appsInInterval > 0) {
          loyalCustomers.push({
            ...customer,
            loyaltyPoints,
          });
        }
      });

      setLoyalCustomers(loyalCustomers);
    }
  }, [appointments, customers, activeMonths]);

  // CONTENTS

  // data grid
  // determine the columns of the dataGrid
  const customerListColumns = [
    { field: "loyaltyPoints", headerName: "Loyalty Points", width: 150 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "phone", headerName: "Phone" },
    { field: "memo", headerName: "Memo", width: 400 },
  ];

  // build the customer list data rows array for the dataGrid
  loyalCustomers.sort((a, b) => {
    return b.loyaltyPoints - a.loyaltyPoints;
  });
  const customerListRows = loyalCustomers.map((customer) => {
    const row = {
      id: customer.customerId,
      loyaltyPoints: customer.loyaltyPoints,
      name: customer.name,
      phone: customer.phone,
      memo: customer.memo,
    };
    return row;
  });

  let contentDataGrid = "";
  if (!appointmentData?.loading && !customerData?.loading) {
    if (customerListRows?.length > 0) {
      contentDataGrid = <CustomDataGrid columns={customerListColumns} rows={customerListRows} />;
    } else {
      contentDataGrid = (
        <Typography variant="h5" style={{ color: "grey" }} sx={{ m: 1 }}>
          There is no regular customer in the given interval.
        </Typography>
      );
    }
  }

  // title
  const contentTitle = (
    <Typography className={classes.title} variant="h4">
      Regular Customer List
    </Typography>
  );

  // controls
  const sliderChangeHandler = (e) => {
    const months = parseInt(e.target.value);
    setActiveMonths(months);
  };
  const valuetext = (value) => {
    return `${value} months`;
  };
  const contentControls = (
    <Box className={classes.controls}>
      <Typography variant="h6" gutterBottom>
        Number of Active Months
      </Typography>
      <Slider
        onChange={sliderChangeHandler}
        aria-label="Months"
        defaultValue={6}
        getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        step={1}
        marks
        min={1}
        max={12}
      />
    </Box>
  );

  // loading
  let contentLoading = "";
  if (appointmentData?.loading || customerData?.loading) {
    contentLoading = <ProgressCircular />;
  }

  // errors
  let contentErrors = "";
  if (appointmentData?.error || customerData?.error) {
    const appErr = appointmentData?.error;
    const custErr = customerData?.error;
    contentErrors = (
      <Box className={classes.errors}>
        <Box className={classes.error}>
          <Typography variant="h6" color="gray">
            Appointment Data could Not Load because an unexpected error occurred:
          </Typography>
          <Typography variant="h5" color="error">
            {appErr}
          </Typography>
        </Box>
        <Box className={classes.error}>
          <Typography variant="h6" color="gray">
            Customer Data could Not Load because an unexpected error occurred:
          </Typography>
          <Typography variant="h5" color="error">
            {custErr}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Grid item xs={12}>
      {contentTitle}
      {contentControls}
      {contentDataGrid}
      {contentLoading}
      {contentErrors}
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    appointmentData: state.appointment,
    customerData: state.customer,
  };
};

export default connect(mapStateToProps)(RegularCustomers);
