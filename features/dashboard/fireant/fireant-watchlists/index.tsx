/* eslint-disable @typescript-eslint/no-explicit-any */
// Import libraries
import { GridColDef } from "@mui/x-data-grid-premium";
import { Box } from "@mui/material";
import { useState } from "react";

// Import local files
import WatchlistConfig from "../@components/WatchlistConfig";
import useFireantStore from "@/@core/services/fireant/useFireantStore";
import Table from "@/@core/components/table";
import { useEffect } from "react";
import FireantService from "@/@core/services/fireant/service";

const FireantWatchlist = () => {
  const selectedWatchlist = useFireantStore((state) => state.selectedWatchlist);
  const [rows, setRows] = useState<any>([]);

  const columns: GridColDef[] = [
    {
      field: "symbol",
      headerName: "Symbol",
      flex: 1,
    },
    {
      field: "priceChange",
      headerName: "+/-",
      flex: 1,
    },
    {
      field: "pricePercentChange",
      headerName: "%",
      flex: 1,
    },
    {
      field: "gapOpen",
      headerName: "gapOpen (test)",
      flex: 1,
    },
    {
      field: "putthroughValue",
      headerName: "putthroughValue (billions)",
      flex: 1,
      renderCell: (params) => {
        return params.value
          ? `${(params.value / 1_000_000_000).toFixed(0)}`
          : "-";
      },
    },
    {
      field: "date",
      headerName: "date",
      flex: 1,
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        const promises: any = selectedWatchlist?.symbols.map((symbol) =>
          FireantService.historicalPrice(symbol)
        );
        const res = await Promise.all(promises);
        const mappedRes = res.map((i) => {
          const priceChange = Number(
            (i[0].priceClose - i[0].priceBasic).toFixed(2)
          );
          return {
            ...i[0],
            id: i[0].symbol,
            priceChange,
            pricePercentChange: Number(
              ((priceChange / i[0].priceBasic) * 100).toFixed(2)
            ),
            gapOpen: Number(i[0].priceLow - i[1].priceHigh).toFixed(2),
          };
        });
        setRows(mappedRes);
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    })();
  }, [selectedWatchlist?.symbols]);

  return (
    <div>
      <h1>Fireant Watchlist</h1>
      <WatchlistConfig />
      <Box sx={{ height: "400px" }}>
        <Table columns={columns} rows={rows} />
      </Box>
    </div>
  );
};

export default FireantWatchlist;
