"use client";

import {
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from "@mui/x-data-grid-premium";

import Table from "@/@core/components/table";

const DashboardTable = ({ rows, initialStateConfig, columns }: any) => {
  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: initialStateConfig,
  });

  return (
    <Table
      rows={rows}
      columns={columns}
      apiRef={apiRef}
      initialState={initialState}
    />
  );
};

export default DashboardTable;
