/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  DataGridPremium,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid-premium";

type Props = {
  apiRef?: any;
  rows: any[];
  columns: GridColDef[];
  initialState?: any;
};

export default function Table({ apiRef, rows, columns, initialState }: Props) {
  return (
    <DataGridPremium
      apiRef={apiRef}
      rows={rows}
      columns={columns}
      initialState={
        initialState
          ? { ...initialState, density: "compact" }
          : {
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
              density: "compact",
            }
      }
      slots={{ toolbar: GridToolbar }}
      pageSizeOptions={[5]}
      checkboxSelection
      disableRowSelectionOnClick
    />
  );
}
