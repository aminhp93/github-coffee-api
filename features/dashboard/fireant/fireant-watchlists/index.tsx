// Import libraries
import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import chunk from "lodash/chunk";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

// Import local files: relative path
import useFireantStore from "@/@core/services/fireant/useFireantStore";
import Table from "@/@core/components/table";
import FireantService from "@/@core/services/fireant/service";

// Import local files: absolute path
import { COLUMNS, CHUNK_SIZE, WAIT_TIMEOUT } from "./constants";
import { PromiseResponse } from "./types";
import { mapData } from "./utils";
import WatchlistConfig from "../@components/WatchlistConfig";

const FireantWatchlist = () => {
  const selectedWatchlist = useFireantStore((state) => state.selectedWatchlist);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rows, setRows] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<string>("all");

  const handleTest = async (symbol: string) => {
    try {
      const historicalPriceData = await FireantService.historicalPrice(symbol);
      const fundamentalData = await FireantService.fundamental(symbol);

      return {
        symbol,
        historicalPriceData,
        fundamentalData,
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return {
        symbol,
        historicalPriceData: undefined,
        fundamentalData: undefined,
      };
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const listSymbol = selectedWatchlist?.symbols ?? [];

        let result: PromiseResponse[] = [];
        const chunkedListSymbols = chunk(listSymbol, CHUNK_SIZE);

        for (let i = 0; i < chunkedListSymbols.length; i++) {
          const listPromises = [];

          for (let j = 0; j < chunkedListSymbols[i].length; j++) {
            listPromises.push(handleTest(chunkedListSymbols[i][j]));
          }

          // wait 1s
          await new Promise((resolve) => setTimeout(resolve, WAIT_TIMEOUT));
          const res = await Promise.all(listPromises);

          result = [...result, ...res];
        }

        const mappedRes = mapData(result);

        setRows(mappedRes);
        setLoading(false);
      } catch (err) {
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

  const controlCompany = {
    value: config,
    onChange: (event: React.MouseEvent<HTMLElement>, data: string) => {
      setConfig(data);
    },
    exclusive: true,
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <WatchlistConfig disabled={loading} />
        </Box>
        <Box>
          <ToggleButtonGroup size="small" {...controlCompany}>
            {[
              "all",
              "fundamental",
              "financialReports",
              "financialIndicators",
              "posts",
              "news",
            ].map((item) => (
              <ToggleButton
                value={item}
                key={item}
                sx={{
                  textTransform: "none",
                }}
              >
                {item}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Box
        sx={{
          height: "400px",
          "& .color-red": {
            color: "red",
          },
          "& .color-green": {
            color: "green",
          },
          "& .color-unset": {
            color: "unset",
          },
        }}
      >
        <Table
          columns={COLUMNS}
          checkboxSelection={false}
          rows={rows}
          initialState={{
            columns: {
              columnVisibilityModel: {
                date: false,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default FireantWatchlist;
