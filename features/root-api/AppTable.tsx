/* eslint-disable @typescript-eslint/no-explicit-any */

import Table from "@/@core/components/table";
import { useRequestStore } from "@/@core/store/request";
import { GridColDef } from "@mui/x-data-grid-premium";

const AppTable = () => {
  const response = useRequestStore((s) => s.response);
  const listWatchlist = response?.data;
  const selectedWatchlist = listWatchlist?.[0];
  //   convert response to rows
  const rows = selectedWatchlist?.symbols.map((symbol: any, index: number) => {
    return {
      id: index + 1,
      symbol: symbol,
    };
  });

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "symbol",
      headerName: "Symbol",
      width: 150,
      editable: true,
    },
  ];

  return <Table rows={rows || []} columns={columns || []} />;
};

export default AppTable;
