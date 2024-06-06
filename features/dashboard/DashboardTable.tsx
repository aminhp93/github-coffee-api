"use client";

import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from "@mui/x-data-grid-premium";

const DashboardTable = ({ rows, initialStateConfig, columns }: any) => {
  console.log(rows, initialStateConfig, columns);
  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: initialStateConfig,
  });

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
