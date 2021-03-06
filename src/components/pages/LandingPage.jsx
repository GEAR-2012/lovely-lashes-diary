import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Grid, Typography } from "@mui/material";
import { connect } from "react-redux";
import ProgressCircular from "../UI/ProgressCircular";

const LandingPage = ({ userData, deviceData }) => {
  const navigate = useNavigate();
  const isMobile = deviceData.isMobile;

  const [isUserVerified, setIsUserVerified] = useState(null);

  // get if the current user is verified or not
  useEffect(() => {
    setIsUserVerified(null);
    if (userData.user) {
      const isEmailVerified = userData.user.emailVerified;
      const userName = userData.user.displayName;
      if (isEmailVerified && userName === "Lovely Lashes") {
        setIsUserVerified(true);
      } else {
        setIsUserVerified(false);
      }
    }
  }, [userData]);

  const handleNavigate = (e) => {
    const id = e.target.id;
    navigate(`/${id}`);
  };

  // loading
  let contentLoading = "";
  if (userData.loading) {
    contentLoading = (
      <Grid item xs={12}>
        <ProgressCircular />
      </Grid>
    );
  }

  // verified
  let contentVerified = "";
  if (isUserVerified === true) {
    contentVerified = (
      <Grid container item xs={12} md={4} spacing={2}>
        <React.Fragment>
          <Grid item xs={12}>
            <Button
              fullWidth
              id="customer_create"
              onClick={handleNavigate}
              variant="contained"
              size={isMobile ? "medium" : "large"}
            >
              Create Customer
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              id="appointment_create"
              onClick={handleNavigate}
              variant="contained"
              size={isMobile ? "medium" : "large"}
            >
              Create Appointment
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              id="appointment_list"
              onClick={handleNavigate}
              variant="contained"
              size={isMobile ? "medium" : "large"}
            >
              Appointment List
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              id="customer_list"
              onClick={handleNavigate}
              variant="contained"
              size={isMobile ? "medium" : "large"}
            >
              Customer List
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              id="statistics"
              onClick={handleNavigate}
              variant="contained"
              size={isMobile ? "medium" : "large"}
            >
              Statistics
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              id="regular_customers"
              onClick={handleNavigate}
              variant="contained"
              size={isMobile ? "medium" : "large"}
            >
              Regular Customers
            </Button>
          </Grid>
        </React.Fragment>
      </Grid>
    );
  }

  // not verified
  let contentNotVerified = "";
  if (isUserVerified === false) {
    contentNotVerified = (
      <Grid item xs={12}>
        <Typography variant="h4" color="error">
          Sorry You have no permission to see this content.
        </Typography>
      </Grid>
    );
  }

  return (
    <React.Fragment>
      {contentLoading}
      {contentVerified}
      {contentNotVerified}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    userData: state.user,
    deviceData: state.device,
  };
};

export default connect(mapStateToProps)(LandingPage);
