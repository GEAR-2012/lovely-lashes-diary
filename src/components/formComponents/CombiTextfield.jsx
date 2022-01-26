import { TextField } from "@mui/material";
import React from "react";

const CombiTextfield = ({
  size,
  label,
  name,
  value,
  error,
  handleChange,
  handleBlur,
  required = false,
  multiline = false,
}) => {
  return (
    <TextField
      error={!!error}
      helperText={error}
      fullWidth
      size={size}
      variant="outlined"
      label={label}
      name={name}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      multiline={multiline}
      required={required}
    />
  );
};

export default CombiTextfield;
