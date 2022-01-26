import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const ProgressCircular = () => {
  return (
    <Box sx={{ my: 4, display: "flex", justifyContent: "center" }}>
      <CircularProgress />
    </Box>
  );
};

export default ProgressCircular;
