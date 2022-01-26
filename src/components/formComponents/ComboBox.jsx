import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Box, FormControl, FormHelperText } from "@mui/material";

export default function ComboBox({ disabled, error, handleBlur, customerId, options, getInput, required }) {
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (!customerId) {
      setValue(null);
    } else {
      const valueByCusId = options.filter((opt) => {
        return opt.id === customerId;
      })[0];

      if (!valueByCusId) {
        setValue(null);
      } else {
        setValue(valueByCusId);
      }
    }
  }, [customerId]);

  return (
    <FormControl error={!!error}>
      <Autocomplete
        disabled={disabled}
        onChange={(event, newValue) => {
          setValue(newValue);
          getInput(newValue);
        }}
        onBlur={handleBlur}
        value={value}
        size="small"
        disablePortal
        id="combo-box"
        options={options}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => `${option.name} ${option.phone} ${option.memo}`}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            {option.name} {option.phone} {option.memo}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            required={required}
            error={!!error}
            {...params}
            label="Select Customer"
            name="customerId"
            inputProps={{
              ...params.inputProps,
              autoComplete: "off", // disable autocomplete and autofill
            }}
          />
        )}
      />
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
}
