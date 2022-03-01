import React from "react";
import { connect } from "react-redux";
import { Divider, Grid, Typography } from "@mui/material";
import ProgressCircular from "../UI/ProgressCircular";
import useFirstLastTime from "../../hooks/useFirstLastTime";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 100,
    color: theme.palette.text.secondary,
    [theme.breakpoints.down("md")]: {
      fontSize: "1.8rem",
    },
  },
  data: {
    fontWeight: 100,
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down("md")]: {
      fontSize: "1rem",
    },
  },
}));

const Statistics = ({ customerData, appointmentData }) => {
  const classes = useStyles();

  let loading = null;

  if (customerData.loading || appointmentData.loading) {
    loading = true;
  } else {
    loading = false;
  }

  // custom hooks
  const { timeOfFirstAppointment, timeOfLastAppointment } = useFirstLastTime(appointmentData.appointments);

  const statDatas = {
    customerCount: customerData.customers.length,
    appointmentCount: appointmentData.appointments.length,
    timeOfFirstAppointment,
    timeOfLastAppointment,
  };

  // page title
  const contentTitle = (
    <Grid item xs={12}>
      <Typography className={classes.title} variant="h4">
        Statistics
      </Typography>
      <Divider sx={{ my: 3 }} />
    </Grid>
  );

  // loading
  let contentLoading = "";
  if (loading) {
    contentLoading = (
      <Grid item xs={12}>
        <ProgressCircular />
      </Grid>
    );
  }

  // datas
  let contentDatas = "";
  if (!loading && statDatas) {
    contentDatas = (
      <Grid item xs={12}>
        <Typography className={classes.data} variant="h5">
          Number of Customers: <strong>{statDatas.customerCount}</strong>
        </Typography>
        <Typography className={classes.data} variant="h5">
          Number of Appointments: <strong>{statDatas.appointmentCount}</strong>
        </Typography>
        <Typography className={classes.data} variant="h5">
          Time of the first Appointment: <strong>{statDatas.timeOfFirstAppointment}</strong>
        </Typography>
        <Typography className={classes.data} variant="h5">
          Time of the last Appointment: <strong>{statDatas.timeOfLastAppointment}</strong>
        </Typography>
      </Grid>
    );
  }

  return (
    <React.Fragment>
      {contentTitle}
      {contentLoading}
      {contentDatas}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    customerData: state.customer,
    appointmentData: state.appointment,
  };
};

export default connect(mapStateToProps)(Statistics);
