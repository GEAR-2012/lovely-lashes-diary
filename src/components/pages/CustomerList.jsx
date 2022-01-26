import React from "react";
import { connect } from "react-redux";
import { Box, Grid, Typography } from "@mui/material";
import ProgressCircular from "../UI/ProgressCircular";
import { useNavigate } from "react-router-dom";
import CustomDataGrid from "../UI/CustomDataGrid";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  title: {
    [theme.breakpoints.down("md")]: {
      fontSize: "1.8rem",
      fontWeight: 100,
    },
  },
}));

const CustomerList = ({ customerData }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  // determine the columns of the dataGrid
  const customerListColumns = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "phone", headerName: "Phone" },
    { field: "memo", headerName: "Memo", width: 400 },
  ];

  // build the customer list data rows array for the dataGrid
  const customerListRows = customerData?.customers.map((customer) => {
    const row = {
      id: customer.customerId,
      name: customer.name,
      phone: customer.phone,
      memo: customer.memo,
    };
    return row;
  });

  // redirect to customer details page by id
  const handleRowDoubleClick = (id) => {
    navigate(`/customer_details/${id}`);
  };

  return (
    <Grid item xs={12} md={8}>
      {customerData.loading ? (
        <ProgressCircular />
      ) : (
        <Box>
          <Typography className={classes.title} variant="h4">
            Customer List
          </Typography>
          {customerData.error ? (
            <Box sx={{ padding: "1.4rem" }}>
              <Typography variant="h5">Customer List could not be open because an Error Occured:</Typography>
              <Typography variant="h5" color="error">
                {customerData.error}
              </Typography>
            </Box>
          ) : customerListRows.length > 0 ? (
            <CustomDataGrid columns={customerListColumns} rows={customerListRows} action={handleRowDoubleClick} />
          ) : (
            <Typography variant="h5" style={{ color: "grey" }} sx={{ m: 1 }}>
              There is no saved customer yet
            </Typography>
          )}
        </Box>
      )}
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    customerData: state.customer,
  };
};

export default connect(mapStateToProps)(CustomerList);
