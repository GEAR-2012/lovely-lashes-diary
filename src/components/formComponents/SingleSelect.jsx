import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

const SingleSelect = ({ handleBlur, error, label, name, value, options, handleChange, required, disabled }) => {
  return (
    <FormControl disabled={disabled} error={!!error} fullWidth required={required}>
      <InputLabel size="small" id={name}>
        {label}
      </InputLabel>
      <Select
        size="small"
        labelId={name}
        id={name}
        label={label}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
      >
        <MenuItem value="">Select one</MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
};

export default SingleSelect;
