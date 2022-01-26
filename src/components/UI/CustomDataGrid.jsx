import React from "react";
import { DataGrid } from "@mui/x-data-grid";

const CustomDataGrid = ({ columns, rows, action }) => {
  const handleRowClick = (params) => {
    action(params.id);
  };

  return (
    <div style={{ height: 400 }}>
      <DataGrid
        rowHeight={25}
        onRowClick={handleRowClick}
        sx={{ my: 5 }}
        columns={columns}
        rows={rows}
        pageSize={25}
        disableSelectionOnClick
      />
    </div>
  );
};

export default CustomDataGrid;
