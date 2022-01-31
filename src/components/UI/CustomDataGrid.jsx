import React, { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const CustomDataGrid = ({ columns, rows, action }) => {
  const [pageSize, setPageSize] = useState(25);

  const handleRowClick = (params) => {
    action(params.id);
  };

  const handlePageSizeChange = (num) => {
    setPageSize(num);
  };

  return (
    <div style={{ height: 400 }}>
      <DataGrid
        rowHeight={41}
        onRowClick={handleRowClick}
        sx={{ my: 5 }}
        columns={columns}
        rows={rows}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        disableSelectionOnClick
        components={{
          Toolbar: GridToolbar,
        }}
      />
    </div>
  );
};

export default CustomDataGrid;
