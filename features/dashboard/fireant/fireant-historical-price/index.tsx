/* eslint-disable @typescript-eslint/no-explicit-any */

// Import libaries
import { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";
import Highcharts from "highcharts";
import { GridColDef } from "@mui/x-data-grid-premium";

// Import local files
import { getDefaultOptions } from "@/@core/components/chart/utils";
import FireantService from "@/@core/services/fireant/service";
import useFireantStore from "@/@core/services/fireant/useFireantStore";
import { RawData } from "../../types";
import DashboardTable from "../../@components/DashboardTable";
import TimeAndDisplayConfig from "../../@components/TimeAndDisplayConfig";
import useConfigStore from "../../useConfigStore";
import { getRows, formatNumberColumn, DIVIDER } from "./utils";
import SymbolConfig from "../../@components/SymbolConfig";

const FireantHistoricalPrice = () => {
  const config = useConfigStore((state) => state.config);
  const selectedSymbol = useFireantStore((state) => state.selectedSymbol);

  const [rawData, setRawData] = useState<RawData>([]);
  const [rows, setRows] = useState<any>([]);
  const [options, setOptions] =
    useState<Highcharts.Options>(getDefaultOptions());

  useEffect(() => {
    (async () => {
      try {
        if (!selectedSymbol) return;
        const res = await FireantService.historicalPrice(selectedSymbol);
        const rows = getRows(res);
        setRawData(res);
        setRows(rows);
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    })();
  }, [selectedSymbol]);

  useEffect(() => {
    setOptions((prev) => {
      // convert config.timeRange to miliseconds like '1m' => 30 * 24 * 3600 * 1000
      let subTractTimestamp = 0;
      if (config.timeRange === "1m") {
        subTractTimestamp = 30 * 24 * 3600 * 1000;
      } else if (config.timeRange === "1w") {
        subTractTimestamp = 7 * 24 * 3600 * 1000;
      } else if (config.timeRange === "1d") {
        subTractTimestamp = 24 * 3600 * 1000;
      }

      return {
        ...prev,
        xAxis: [
          {
            type: "datetime",
            gridLineWidth: 1,
            tickInterval: 24 * 3600 * 1000,
            min: new Date().getTime() - subTractTimestamp,
            // get current time and add 1 day
            max: new Date().getTime() + 86400000,
          },
        ],
      };
    });
  }, [config.timeRange]);

  return (
    <Box>
      <TimeAndDisplayConfig />
      <SymbolConfig />
      <Box mt={2}>
        {config.displayType === "raw-data" && (
          <Box
            sx={{
              height: "300px",
              overflow: "auto",
            }}
          >
            <pre>{JSON.stringify(rawData, null, 2)}</pre>
          </Box>
        )}
        {config.displayType === "table" && (
          <DashboardTable
            columns={columns}
            rows={rows}
            initialStateConfig={{
              columns: {
                columnVisibilityModel: {
                  // Hide columns status and traderName, the other columns will remain visible
                  priceAverage: false,
                  symbol: false,
                  priceHigh: false,
                  priceLow: false,
                  priceOpen: false,
                  buyForeignQuantity: false,
                  buyForeignValue: false,
                  sellForeignQuantity: false,
                  sellForeignValue: false,
                  buyCount: false,
                  buyQuantity: false,
                  sellCount: false,
                  sellQuantity: false,
                  adjRatio: false,
                  currentForeignRoom: false,
                  propTradingNetDealValue: false,
                  propTradingNetPTValue: false,
                  propTradingNetValue: false,
                  unit: false,
                },
              },
            }}
          />
        )}
        {config.displayType === "chart" && (
          <HighchartsReact highcharts={Highcharts} options={options} />
        )}
      </Box>
    </Box>
  );
};

export default FireantHistoricalPrice;

const columns: GridColDef[] = [
  {
    field: "date",
    headerName: "date",
    width: 150,
  },
  {
    field: "symbol",
    headerName: "symbol",
    width: 150,
  },
  {
    field: "priceHigh",
    headerName: "priceHigh",
    width: 150,
  },
  {
    field: "priceLow",
    headerName: "priceLow",
    width: 150,
  },
  {
    field: "priceOpen",
    headerName: "priceOpen",
    width: 150,
  },
  {
    field: "priceAverage",
    headerName: "priceAverage",
    width: 150,
  },
  {
    field: "priceClose",
    headerName: "priceClose",
    width: 150,
  },
  {
    field: "priceBasic",
    headerName: "priceBasic",
    width: 150,
  },
  {
    field: "totalVolume",
    headerName: "totalVolume",
    width: 150,
    renderCell: (params) => {
      return formatNumberColumn(params.value, DIVIDER.million);
    },
  },
  {
    field: "dealVolume",
    headerName: "dealVolume",
    width: 150,
    renderCell: (params) => {
      return formatNumberColumn(params.value, DIVIDER.million);
    },
  },
  {
    field: "putthroughVolume",
    headerName: "putthroughVolume",
    width: 150,
    renderCell: (params) => {
      return formatNumberColumn(params.value, DIVIDER.million);
    },
  },
  {
    field: "totalValue",
    headerName: "totalValue",
    width: 150,
    renderCell: (params) => {
      return formatNumberColumn(params.value);
    },
  },
  {
    field: "putthroughValue",
    headerName: "putthroughValue",
    width: 150,
    renderCell: (params) => {
      return formatNumberColumn(params.value);
    },
  },
  {
    field: "buyForeignQuantity",
    headerName: "buyForeignQuantity",
    width: 150,
  },
  {
    field: "buyForeignValue",
    headerName: "buyForeignValue",
    width: 150,
  },
  {
    field: "sellForeignQuantity",
    headerName: "sellForeignQuantity",
    width: 150,
  },
  {
    field: "sellForeignValue",
    headerName: "sellForeignValue",
    width: 150,
  },
  {
    field: "buyCount",
    headerName: "buyCount",
    width: 150,
  },
  {
    field: "buyQuantity",
    headerName: "buyQuantity",
    width: 150,
  },
  {
    field: "sellCount",
    headerName: "sellCount",
    width: 150,
  },
  {
    field: "sellQuantity",
    headerName: "sellQuantity",
    width: 150,
  },
  {
    field: "adjRatio",
    headerName: "adjRatio",
    width: 150,
  },
  {
    field: "currentForeignRoom",
    headerName: "currentForeignRoom",
    width: 150,
  },
  {
    field: "propTradingNetDealValue",
    headerName: "propTradingNetDealValue",
    width: 150,
  },
  {
    field: "propTradingNetPTValue",
    headerName: "propTradingNetPTValue",
    width: 150,
  },
  {
    field: "propTradingNetValue",
    headerName: "propTradingNetValue",
    width: 150,
  },
  {
    field: "unit",
    headerName: "unit",
    width: 150,
  },
];
