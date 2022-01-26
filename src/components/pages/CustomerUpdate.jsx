import React from "react";
import { updateCustomer, alertOpen } from "../../redux";
import { connect } from "react-redux";
import CustomerForm from "../forms/CustomerForm";
import { useParams } from "react-router-dom";

const CustomerUpdate = ({ customerData, updateCustomer, alertOpen }) => {
  const { customerId } = useParams();

  const filteredCustomer = customerData.customers.filter((customer) => {
    return customer.customerId === customerId;
  })[0];

  // taking off the unnecessary entries
  const inputs = { ...filteredCustomer };
  delete inputs.customerId;

  const UpdateExistingCustomer = (inputData) => {
    let result = false;
    // Check for same data fields between new customer & existing customers
    let isSameName = false;
    let isSamePhone = false;
    let isSameMemo = false;
    customerData.customers.forEach((customer) => {
      if (customer.customerId !== customerId) {
        if (customer.name === inputData.name) {
          isSameName = true;
        }
        if (customer.phone === inputData.phone) {
          isSamePhone = true;
        }
        if (customer.memo === inputData.memo) {
          isSameMemo = true;
        }
      }
    });

    // if the name, phone & memo does not match
    // Create the new customer else send error msg
    if (!isSameName || !isSamePhone || !isSameMemo) {
      updateCustomer(customerId, inputData);
      // success alert
      alertOpen({ severity: "success", message: "The Customer was updated in the database." });
      result = true;
    } else {
      // error alert
      alertOpen({
        severity: "error",
        message: "Another Customer is already exists in the database with same credentials.",
      });
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

  return (
    <CustomerForm redirect={true} inputs={inputs} formTitle="Update Customer Details" action={UpdateExistingCustomer} />
  );
};

const mapStateToProps = (state) => {
  return {
    customerData: state.customer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCustomer: (id, data) => dispatch(updateCustomer(id, data)),
    //
    alertOpen: (data) => dispatch(alertOpen(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerUpdate);
