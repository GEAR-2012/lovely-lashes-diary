import React from "react";
import { connect } from "react-redux";
import { Divider, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import useFirstLastTime from "../../hooks/useFirstLastTime";
import useSumPayments from "../../hooks/useSumPayments";
import useSumTips from "../../hooks/useSumTips";
import { displayCurrency } from "../../functions";
import ProgressCircular from "../UI/ProgressCircular";

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
  const totalPayment = useSumPayments(appointmentData.appointments);
  const totalTips = useSumTips(appointmentData.appointments);

  const statDatas = {
    customerCount: customerData.customers.length,
    appointmentCount: appointmentData.appointments.length,
    timeOfFirstAppointment,
    timeOfLastAppointment,
    totalPayment,
    totalTips,
    grandTotal: totalPayment + totalTips,
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
        <Typography className={classes.data} variant="h5">
          Total of Payments: <strong>{displayCurrency(statDatas.totalPayment, "£")}</strong>
        </Typography>
        <Typography className={classes.data} variant="h5">
          Total of Tips: <strong>{displayCurrency(statDatas.totalTips, "£")}</strong>
        </Typography>
        <Typography className={classes.data} variant="h5">
          Grand Total: <strong>{displayCurrency(statDatas.grandTotal, "£")}</strong>
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
