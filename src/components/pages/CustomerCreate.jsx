import React from "react";
import { createCustomer, alertOpen } from "../../redux";
import { connect } from "react-redux";
import CustomerForm from "../forms/CustomerForm";

const CustomerCreate = ({ customerData, createCustomer, alertOpen }) => {
  // Create a date/time 'today'
  const unixTimestamp = Date.now();

  const createNewCustomer = (inputData) => {
    let result = false;
    // Check for same data fields between new customer & existing customers
    let isSameName = false;
    let isSamePhone = false;
    let isSameMemo = false;
    customerData.customers.forEach((customer) => {
      if (customer.name === inputData.name) {
        isSameName = true;
      }
      if (customer.phone === inputData.phone) {
        isSamePhone = true;
      }
      if (customer.memo === inputData.memo) {
        isSameMemo = true;
      }
    });

    // if the name, phone & memo does not match
    // Create the new customer else send error msg
    if (!isSameName || !isSamePhone || !isSameMemo) {
      createCustomer(inputData);
      // success alert
      alertOpen({ severity: "success", message: "The Customer was added to the database." });
      result = true;
    } else {
      // error alert
      alertOpen({ severity: "error", message: "This Customer is already exists in the database." });
      result = false;
    }

    // alerts
    if (customerData.error) {
      alertOpen({
        severity: "error",
        message: "An error occurred while Customer details saving: " + customerData.error,
      });
      result = false;
    }

    return result;
  };

  return <CustomerForm formTitle="Create a New Customer" action={createNewCustomer} />;
};

const mapStateToProps = (state) => {
  return {
    customerData: state.customer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createCustomer: (inp) => dispatch(createCustomer(inp)),
    //
    alertOpen: (data) => dispatch(alertOpen(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerCreate);
