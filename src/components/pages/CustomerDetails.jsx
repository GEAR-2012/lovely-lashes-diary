import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { Box, Button, Card, CardActions, CardContent, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ProgressCircular from "../UI/ProgressCircular";

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
    width: 100,
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
}));

const CustomerDetails = ({ customerData, deviceData }) => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const classes = useStyles();
  const isMobile = deviceData.isMobile;

  // local state to hold customer's details
  const [customerDetails, setCustomerDetails] = useState();

  // get customer's details from 'customerData' redux store by customer id
  useEffect(() => {
    const customer = customerData.customers.filter((customer) => {
      return customer.customerId === customerId;
    })[0];

    if (customer) {
      const detailsArray = [
        ["Name", customer.name],
        ["Phone", customer.phone],
        ["Memo", customer.memo],
      ];
      setCustomerDetails(detailsArray);
    }
  }, [customerId, customerData]);

  return (
    <>
      {!customerDetails && (
        <Grid item xs={12}>
          <ProgressCircular />
        </Grid>
      )}
      {customerDetails && (
        <Grid item xs={12} md={8} lg={6} xl={5}>
          <Card className={classes.card} elevation={4}>
            <CardContent>
              <Typography className={classes.title} variant="h4">
                Customer Details
              </Typography>
              <Box className={classes.detailsBox}>
                {customerDetails.map((detail) => (
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
            <CardActions>
              <Button
                size={isMobile ? "small" : "large"}
                onClick={() => navigate(`/customer_update/${customerId}`)}
                variant="contained"
                fullWidth
              >
                Update Customer
              </Button>
            </CardActions>
          </Card>
        </Grid>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    customerData: state.customer,
    deviceData: state.device,
  };
};

export default connect(mapStateToProps)(CustomerDetails);
