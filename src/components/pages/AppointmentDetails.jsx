import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { Box, Button, Card, CardActions, CardContent, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ProgressCircular from "../UI/ProgressCircular";
import { formattedTimestamp, displayCurrency } from "../../functions";
import { openDeleteAppModal } from "../../redux";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(4),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(3),
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1),
    },
  },
  title: {
    fontSize: "2rem",
    fontWeight: 100,
    [theme.breakpoints.down("md")]: {
      textAlign: "center",
      fontSize: "2.2rem",
      fontWeight: 100,
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.6rem",
      fontWeight: 100,
    },
  },
  detailsBox: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    margin: "2rem 0",
    alignItems: "center",

    [theme.breakpoints.down("md")]: {
      gap: 4,
      margin: "2rem 0",
    },
    [theme.breakpoints.down("sm")]: {
      gap: 3,
      margin: "1rem 0",
    },
  },
  detailsItem: {
    width: "100%",
    display: "flex",
    gap: 25,
    alignItems: "center",
    backgroundColor: theme.palette.darken,
    padding: "6px 24px",
    borderTop: "1px solid rgba(255, 255, 255, 0.3)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.3)",
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.down("md")]: {
      padding: "6px 18px",
      gap: 20,
    },
    [theme.breakpoints.down("sm")]: {
      padding: "4px 14px",
      alignItems: "initial",
      flexDirection: "column",
      gap: 4,
    },
  },
  entryTitle: {
    width: 300,
    lineHeight: 1,
    color: theme.palette.text.secondary,
    textAlign: "right",
    fontWeight: 100,
    [theme.breakpoints.down("md")]: {
      width: "50%",
      fontSize: "1.4rem",
      fontWeight: 100,
    },
    [theme.breakpoints.down("sm")]: {
      width: "initial",
      textAlign: "initial",
      fontSize: "1rem",
      fontWeight: 100,
    },
  },
  entryData: {
    fontWeight: 100,
    [theme.breakpoints.down("md")]: {
      fontSize: "1.6rem",
      fontWeight: 100,
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.1rem",
      fontWeight: 100,
      textAlign: "right",
    },
  },
  cardActions: {
    flexDirection: "row",
    gap: theme.spacing(2),
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  },
}));

const AppointmentDetails = ({ appointmentData, customerData, deviceData, openDeleteAppModal }) => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const classes = useStyles();
  const isMobile = deviceData.isMobile;

  // local state to hold appointment's details
  const [appointmentDetails, setAppointmentDetails] = useState();

  // get appointment's details from 'appointmentData' redux store by appointment id
  useEffect(() => {
    if (!customerData.loading && !appointmentData.loading) {
      if (appointmentData.appointments.length > 0) {
        const getAppointmentDetails = (appArr, custArr) => {
          const appointment = appArr.filter((app) => {
            return app.appointmentId === appointmentId;
          })[0];

          if (!appointment) return false;

          let customerObj = custArr.filter((cust) => {
            return cust.customerId === appointment.customerId;
          })[0];

          if (!customerObj) {
            customerObj = {
              name: "Unknown",
              phone: "",
              memo: "",
            };
          }

          const comb_1 = `${appointment.curl_1} ${appointment.thickness_1}`;

          let comb_2 = "";
          if (appointment.curl_2 || appointment.thickness_2) {
            comb_2 = `${appointment.curl_2} ${appointment.thickness_2}`;
          }

          // Calculates the elapsed time till now from a unix timestamp & returns it in days
          const getElapsedTime = (unixTimestamp) => {
            let elapsedTime = 0;
            if (!isNaN(unixTimestamp)) {
              elapsedTime = Date.now() - unixTimestamp;
              elapsedTime = Math.round(elapsedTime / 1000 / 60 / 60 / 24);
            }
            return elapsedTime;
          };

          const elapsedDaysTillNow = getElapsedTime(appointment.timeOfAppointment);

          const detailsArray = [
            ["Customer Name", customerObj.name],
            ["Customer Phone", customerObj.phone],
            ["Customer Memo", customerObj.memo],
            ["Elapsed days since previous", appointment.elapsedTime],
            ["Time of Appointment", formattedTimestamp(appointment.timeOfAppointment)],
            ["Elapsed days till now", elapsedDaysTillNow],
            ["Type of Appointment", appointment.typeOfAppointment],
            ["Type of Lashes", appointment.typeOfLashes],
            ["Combination 1", comb_1],
            ["Combination 2", comb_2],
            ["Length of Lashes", appointment.lashLength.join()],
            ["Shape of Lashes", appointment.shape],
            ["Eyepad usage", appointment.eyepad],
            ["Payment", displayCurrency(appointment.payment, "£")],
            ["Tips", displayCurrency(appointment.tips, "£")],
            ["Appointment Memo", appointment.memo],
          ];
          return detailsArray;
        };

        const detailsArray = getAppointmentDetails(appointmentData.appointments, customerData.customers);

        if (detailsArray) setAppointmentDetails(detailsArray);
      }
    }
  }, [appointmentId, appointmentData, customerData]);

  return (
    <React.Fragment>
      {(customerData.loading || appointmentData.loading) && (
        <Grid item xs={12}>
          <ProgressCircular />
        </Grid>
      )}
      {!customerData.loading && !appointmentData.loading && !appointmentDetails && (
        <Grid item xs={12}>
          <Typography variant="h6" color="error">
            No Appointment found with the provided ID.
          </Typography>
        </Grid>
      )}
      {appointmentDetails && (
        <Grid item xs={12} md={10} lg={8}>
          <Card className={classes.card} elevation={4}>
            <CardContent>
              <Typography className={classes.title} variant="h4">
                Appointment Details
              </Typography>
              <Box className={classes.detailsBox}>
                {appointmentDetails.map((detail) => (
                  <Box className={classes.detailsItem} key={detail[0]}>
                    <Typography className={classes.entryTitle} variant="h6">
                      {detail[0]}:
                    </Typography>
                    <Typography className={classes.entryData} variant="h5">
                      {detail[1]}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
            <CardActions disableSpacing className={classes.cardActions}>
              <Button
                size={isMobile ? "small" : "large"}
                fullWidth
                onClick={() => navigate(`/appointment_update/${appointmentId}`)}
                variant="contained"
              >
                Update Appointment
              </Button>
              <Button
                size={isMobile ? "small" : "large"}
                fullWidth
                onClick={() => openDeleteAppModal(appointmentId)}
                variant="contained"
                color="error"
              >
                Delete Appointment
              </Button>
            </CardActions>
          </Card>
        </Grid>
      )}
    </React.Fragment>
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
    openDeleteAppModal: (id) => dispatch(openDeleteAppModal(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentDetails);
