import { DataGridPremium, GridColDef } from "@mui/x-data-grid-premium";

type Props = {
  rows: any[];
  columns: GridColDef[];
};

export default function Table({ rows, columns }: Props) {
  return (
    <DataGridPremium
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
