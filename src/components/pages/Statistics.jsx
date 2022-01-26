import React from "react";
import { connect } from "react-redux";
import { Divider, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import useFirstLastTime from "../../hooks/useFirstLastTime";
import useSumPayments from "../../hooks/useSumPayments";
import useSumTips from "../../hooks/useSumTips";
import { displayCurrency } from "../../functions";

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

const Statistics = ({ customers, appointments }) => {
  const classes = useStyles();

  // statistic datas:
  const { timeOfFirstAppointment, timeOfLastAppointment } = useFirstLastTime(appointments);
  const totalPayment = useSumPayments(appointments);
  const totalTips = useSumTips(appointments);
  const grandTotal = totalPayment + totalTips;
  const customerCount = customers.length;
  const appointmentCount = appointments.length;

  return (
    <Grid item xs={12}>
      <Typography className={classes.title} variant="h4">
        Statistics
      </Typography>
      <Divider sx={{ my: 3 }} />
      <Typography className={classes.data} variant="h5">
        Number of Customers: <strong>{customerCount}</strong>
      </Typography>
      <Typography className={classes.data} variant="h5">
        Number of Appointments: <strong>{appointmentCount}</strong>
      </Typography>
      <Typography className={classes.data} variant="h5">
        Time of the first Appointment: <strong>{timeOfFirstAppointment}</strong>
      </Typography>
      <Typography className={classes.data} variant="h5">
        Time of the last Appointment: <strong>{timeOfLastAppointment}</strong>
      </Typography>
      <Typography className={classes.data} variant="h5">
        Total of Payments: <strong>{displayCurrency(totalPayment, "£")}</strong>
      </Typography>
      <Typography className={classes.data} variant="h5">
        Total of Tips: <strong>{displayCurrency(totalTips, "£")}</strong>
      </Typography>
      <Typography className={classes.data} variant="h5">
        Grand Total: <strong>{displayCurrency(grandTotal, "£")}</strong>
      </Typography>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    customers: state.customer.customers,
    appointments: state.appointment.appointments,
  };
};

export default connect(mapStateToProps)(Statistics);
