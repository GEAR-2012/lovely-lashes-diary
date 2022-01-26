import { FormControl, FormHelperText, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import React from "react";

const Currency = ({ handleBlur, error, label, name, value, handleChange, symbol }) => {
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      handleChange(e);
    }
  };

  return (
    <FormControl fullWidth error={!!error}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <OutlinedInput
        id={name}
        value={value}
        size="small"
        name={name}
        onChange={handleInputChange}
        onBlur={handleBlur}
        startAdornment={<InputAdornment position="start">{symbol}</InputAdornment>}
        label={label}
      />
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
};

export default Currency;
