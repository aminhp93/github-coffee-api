"use client";

import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
  GridColDef,
} from "@mui/x-data-grid-premium";

const DashboardTable = ({ rows }: any) => {
  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ["groupedSymbol"],
      },
    },
  });

  const columns: GridColDef[] = [
    { field: "groupedSymbol", headerName: "Grouped Symbol", width: 150 },
    { field: "postId", headerName: "postId", width: 100, groupable: false },
    {
      field: "originalContent",
      headerName: "originalContent",
      width: 100,
      groupable: false,
    },
  ];

  return (
    <DataGridPremium
      rows={rows}
      columns={columns}
      apiRef={apiRef}
      initialState={initialState}
    />
  );
};

export default DashboardTable;
