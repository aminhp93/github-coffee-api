import { useState, useEffect } from "react";
import chunk from "lodash/chunk";

import useFireantStore from "@/@core/services/fireant/useFireantStore";
import FireantService from "@/@core/services/fireant/service";
import { PromiseResponse } from "./types";
import { mapData } from "./utils";
import { CHUNK_SIZE, WAIT_TIMEOUT } from "./constants";

export const useFireantWatchlist = () => {
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

  return {
    rows,
    loading,
    config,
    setConfig,
  };
};
