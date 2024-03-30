import { DataGrid, GridColDef } from "@mui/x-data-grid";

type Props = {
  rows: any[];
  columns: GridColDef[];
};

export default function Table({ rows, columns }: Props) {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
      }}
      pageSizeOptions={[5]}
      checkboxSelection
      disableRowSelectionOnClick
    />
  );
}
