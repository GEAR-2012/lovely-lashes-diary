import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Divider, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { formattedTimestamp } from "../../functions";
import ProgressCircular from "../UI/ProgressCircular";
import { useNavigate } from "react-router-dom";
import CustomDataGrid from "../UI/CustomDataGrid";
import ResponsiveDateRangePicker from "../UI/ResponsiveDateRangePicker";
import { dateToUnixTimestamp } from "../../functions/dateToUnixTimestamp";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down("md")]: {
      fontSize: "1.8rem",
      fontWeight: 100,
    },
  },
  filterTitle: {
    fontSize: "1.6rem",
    fontWeight: 100,
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down("md")]: {
      fontSize: "1.4rem",
    },
  },
  emptyMessage: {
    fontSize: "1.8rem",
    [theme.breakpoints.down("md")]: {
      fontSize: "1.2rem",
    },
  },
  errorTitle: {
    fontSize: "1.6rem",
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down("md")]: {
      fontSize: "1rem",
    },
  },
  errorMsg: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    [theme.breakpoints.down("md")]: {
      fontSize: "1.2rem",
    },
  },
}));

const AppointmentList = ({ customerData, appointmentData }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  // for date range picker component only
  const [dateRangeValue, setDateRangeValue] = useState([null, null]);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [appointmentListRows, setAppointmentListRows] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);

  // get appointment list from redux state
  useEffect(() => {
    if (appointmentData) {
      setAppointments(appointmentData.appointments);
    }
  }, [appointmentData]);

  // filtering appointments based date picker data
  useEffect(() => {
    if (appointmentData) {
      // convert date range to unix timestamp range
      const start = dateToUnixTimestamp(dateRangeValue[0]);
      const end = dateToUnixTimestamp(dateRangeValue[1]);

      // filter the list
      if (start && end) {
        setIsFiltered(true);
        const filtered = appointmentData.appointments.filter((app) => {
          return app.timeOfAppointment > start && app.timeOfAppointment < end;
        });
        setFilteredAppointments(filtered);
      } else {
        setIsFiltered(false);
      }
    }
  }, [appointmentData, dateRangeValue]);

  // determine the columns of the dataGrid
  const appointmentListColumns = [
    { field: "name", headerName: "Name", width: 100 },
    { field: "elapsedSincePrev", headerName: "Elapsed days since prev", width: 200, type: "number" },
    { field: "timeOfAppointment", headerName: "Time of Appointment", width: 180 },
    { field: "elapsedTillNow", headerName: "Elapsed till now", width: 130, type: "number" },
    { field: "typeOfAppointment", headerName: "Type of Appointment", width: 160 },
    { field: "typeOfLashes", headerName: "Type of Lashes", width: 160 },
    { field: "combination_1", headerName: "Combination 1", width: 160 },
    { field: "combination_2", headerName: "Combination 2", width: 160 },
    { field: "lashLength", headerName: "Length", width: 210 },
    { field: "shape", headerName: "Shape", width: 100 },
    { field: "eyepad", headerName: "Eye Pad", width: 200 },
    { field: "payment", headerName: "Payment", width: 90, type: "number" },
    { field: "tips", headerName: "Tips", width: 80, type: "number" },
    { field: "memo", headerName: "Memo", width: 400 },
  ];

  // build the appointment list data rows array for the dataGrid
  useEffect(() => {
    let listRows;

    // function to make list rows (for data grid) from a given list & return it
    const makeAppointmentListRows = (list) => {
      const rows = list.map((appointment) => {
        // get the relevant customer from 'customerData' redux store
        const customerObj = customerData.customers.filter((cust) => {
          return cust.customerId === appointment.customerId;
        })[0];

        let customerName = "Unknown";
        if (customerObj) {
          customerName = customerObj.name;
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

        const row = {
          id: appointment.appointmentId,
          name: customerName,
          elapsedSincePrev: appointment.elapsedTime,
          timeOfAppointment: formattedTimestamp(appointment.timeOfAppointment),
          elapsedTillNow: elapsedDaysTillNow,
          typeOfAppointment: appointment.typeOfAppointment,
          typeOfLashes: appointment.typeOfLashes,
          combination_1: comb_1,
          combination_2: comb_2,
          lashLength: appointment.lashLength.join(),
          shape: appointment.shape,
          eyepad: appointment.eyepad,
          payment: appointment.payment,
          tips: appointment.tips,
          memo: appointment.memo,
        };
        return row;
      });
      return rows;
    };

    // decide which list will be used & make the list rows
    if (!customerData.loading) {
      if (isFiltered) {
        // filtered list
        listRows = makeAppointmentListRows(filteredAppointments);
      } else if (!isFiltered) {
        // not filtered list
        listRows = makeAppointmentListRows(appointments);
      }
    }

    // set the list rows into a local state
    setAppointmentListRows(listRows);
  }, [customerData, appointments, filteredAppointments, isFiltered]);

  // redirect to appointment details page by id
  const handleRowClick = (id) => {
    navigate(`/appointment_details/${id}`);
  };

  //
  // ***********************************
  // CONTENTS TO RENDER
  // ***********************************
  //

  // set data grid
  let contentDataGrid = "";
  if (appointmentListRows?.length > 0) {
    contentDataGrid = (
      <CustomDataGrid columns={appointmentListColumns} rows={appointmentListRows} action={handleRowClick} />
    );
  }

  // set loading
  let contentLoading = "";
  if (appointmentData.loading || customerData.loading) {
    contentLoading = <ProgressCircular />;
  }

  // set redux state error
  let contentRStateError = "";
  if (appointmentData.error || customerData.error) {
    let errorMsg;
    if (appointmentData.error) errorMsg = appointmentData.error;
    if (customerData.error) errorMsg = customerData.error;

    contentRStateError = (
      <Box>
        <Typography className={classes.errorTitle} variant="h5" color="textSecondary">
          Appointment List could not be open because an Error Occured:
        </Typography>
        <Typography className={classes.errorMsg} variant="h5" color="error">
          {errorMsg}Error Message Danger
        </Typography>
      </Box>
    );
  }

  // set title
  const contentTitle = (
    <Box>
      <Typography className={classes.title} variant="h4">
        Appointment List
      </Typography>
      <Divider sx={{ mb: 2 }} />
    </Box>
  );

  // set filter
  let contentFilter = "";
  if (appointments.length > 0) {
    contentFilter = (
      <Box>
        <Typography className={classes.filterTitle} variant="h5" color="textSecondary">
          Filters
        </Typography>
        <ResponsiveDateRangePicker value={dateRangeValue} setValue={setDateRangeValue} />
      </Box>
    );
  }

  // set empty list message
  let contentEmptyMessage = "";
  if (appointmentListRows?.length === 0) {
    contentEmptyMessage = (
      <Typography color="textSecondary" variant="h5" className={classes.emptyMessage} sx={{ my: 3 }}>
        {isFiltered ? "No Mathes found by Date range filter" : "There is no saved appointment yet"}
      </Typography>
    );
  }

  return (
    <Grid item xs={12}>
      {contentTitle}
      {contentLoading}
      {contentFilter}
      {contentDataGrid}
      {contentEmptyMessage}
      {contentRStateError}
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    customerData: state.customer,
    appointmentData: state.appointment,
  };
};

export default connect(mapStateToProps)(AppointmentList);
