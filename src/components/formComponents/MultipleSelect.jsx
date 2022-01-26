import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FormHelperText } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(option, selectedOptions, theme) {
  return {
    fontWeight:
      selectedOptions.indexOf(option) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

const MultipleSelect = ({ handleBlur, error, initValue, name, label, options, size, getOptions, required }) => {
  const theme = useTheme();

  useEffect(() => {
    if (initValue) {
      setSelectedOptions(initValue);
    }
  }, [initValue]);

  const [selectedOptions, setSelectedOptions] = useState(initValue);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedOptions(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div>
      <FormControl error={!!error} size={size} fullWidth required={required}>
        <InputLabel id="multiple-select-label">{label}</InputLabel>
        <Select
          name={name}
          size={size}
          labelId="multiple-select-label"
          id="multiple-select"
          multiple
          value={selectedOptions}
          onChange={handleChange}
          onBlur={handleBlur}
          onClose={() => getOptions(selectedOptions)}
          input={<OutlinedInput label={label} />}
          MenuProps={MenuProps}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option} style={getStyles(option, selectedOptions, theme)}>
              {option}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{error}</FormHelperText>
      </FormControl>
    </div>
  );
};

export default MultipleSelect;
