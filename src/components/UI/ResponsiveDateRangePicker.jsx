import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MobileDateRangePicker from "@mui/lab/MobileDateRangePicker";
import DesktopDateRangePicker from "@mui/lab/DesktopDateRangePicker";

const ResponsiveDateRangePicker = ({ deviceData, value, setValue }) => {
  // const [value, setValue] = useState([null, null]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={3}>
        {deviceData.isMobile && (
          <MobileDateRangePicker
            startText="Start Date"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            renderInput={(startProps, endProps) => (
              <React.Fragment>
                <TextField size="small" {...startProps} />
                <Box sx={{ mx: 2 }}> to </Box>
                <TextField size="small" {...endProps} />
              </React.Fragment>
            )}
          />
        )}
        {!deviceData.isMobile && (
          <DesktopDateRangePicker
            startText="Start Date"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            renderInput={(startProps, endProps) => (
              <React.Fragment>
                <TextField size="small" {...startProps} />
                <Box sx={{ mx: 2 }}> to </Box>
                <TextField size="small" {...endProps} />
              </React.Fragment>
            )}
          />
        )}
      </Stack>
    </LocalizationProvider>
  );
};

const mapStateToProps = (state) => {
  return {
    deviceData: state.device,
  };
};

export default connect(mapStateToProps)(ResponsiveDateRangePicker);
