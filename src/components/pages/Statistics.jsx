import React, { useState, useEffect } from "react";
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

  const [loading, setLoading] = useState(null);
  const [customers, setCustomers] = useState(null);
  const [appointments, setAppointments] = useState(null);
  const [statDatas, setStatDatas] = useState(null);

  // get customers & appointment into local state
  useEffect(() => {
    if (customerData.loading || appointmentData.loading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
    if ((customerData, appointmentData)) {
      setCustomers(customerData.customers);
      setAppointments(appointmentData.appointments);
    }
  }, [customerData, appointmentData]);

  // custom hooks
  const { timeOfFirstAppointment, timeOfLastAppointment } = useFirstLastTime(appointments);
  const totalPayment = useSumPayments(appointments);
  const totalTips = useSumTips(appointments);

  // set up statistic datas into local state
  useEffect(() => {
    if (customers && appointments) {
      setStatDatas({
        customerCount: customers.length,
        appointmentCount: appointments.length,
        timeOfFirstAppointment,
        timeOfLastAppointment,
        totalPayment,
        totalTips,
        grandTotal: totalPayment + totalTips,
      });
    }
  }, [customers, appointments, timeOfFirstAppointment, timeOfLastAppointment, totalPayment, totalTips]);

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
