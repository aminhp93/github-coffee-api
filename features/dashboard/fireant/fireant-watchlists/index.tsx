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

const chunkArray = (array: any[], size: number) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const FireantWatchlist = () => {
  const selectedWatchlist = useFireantStore((state) => state.selectedWatchlist);
  const [rows, setRows] = useState<any>([]);
  const [loading, setLoading] = useState(false);

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

  const handleTest = async (symbol: string) => {
    try {
      // console.log(`start getting last updated of symbol: ${symbol}`);
      const res: any = await FireantService.historicalPrice(symbol);

      return {
        symbol,
        data: res,
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const listSymbol: any = selectedWatchlist?.symbols ?? [];

        let result: any[] = [];
        const chunkedListSymbols = chunkArray(listSymbol, 15);

        for (let i = 0; i < chunkedListSymbols.length; i++) {
          const listPromises = [];

          for (let j = 0; j < chunkedListSymbols[i].length; j++) {
            listPromises.push(handleTest(chunkedListSymbols[i][j]));
          }

          // wait 1s
          await new Promise((resolve) => setTimeout(resolve, 500));
          const res = await Promise.all(listPromises);

          result = [...result, ...res];
        }

        const mappedRes = result.map((i) => {
          const i_0 = i.data[0];
          const i_1 = i.data[1];
          const priceChange = Number(
            (i_0.priceClose - i_0.priceBasic).toFixed(2)
          );
          return {
            ...i_0,
            id: i_0.symbol,
            priceChange,
            pricePercentChange: Number(
              ((priceChange / i_0.priceBasic) * 100).toFixed(2)
            ),
            gapOpen: Number(i_0.priceLow - i_1.priceHigh).toFixed(2),
          };
        });

        setRows(mappedRes);
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        const newRows = selectedWatchlist?.symbols.map((symbol) => ({
          id: symbol,
          symbol,
        }));
        setRows(newRows);
        // eslint-disable-next-line no-console
        console.error(err);
      }
    })();
  }, [selectedWatchlist?.symbols]);

  return (
    <div>
      <h1>Fireant Watchlist</h1>
      <WatchlistConfig disabled={loading} />
      <Box sx={{ height: "400px" }}>
        <Table columns={columns} rows={rows} />
      </Box>
    </div>
  );
};

export default FireantWatchlist;
