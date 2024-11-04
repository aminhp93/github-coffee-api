/* eslint-disable @typescript-eslint/no-explicit-any */

// Import libaries
import { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";
import Highcharts from "highcharts";
import { GridColDef } from "@mui/x-data-grid-premium";

// Import local files
import { getDefaultOptions } from "@/@core/components/chart/utils";
import useFireantStore from "@/@core/services/fireant/useFireantStore";
import { RawData } from "../types";

import ConfigOption from "../@components/TimeAndDisplayConfig";
import useConfigStore from "../useConfigStore";
import Table from "@/@core/components/table";
import FMarketService from "@/@core/services/f-market/service";
import {
  formatNumber,
  getCellClassName,
} from "@/features/dashboard/fireant/fireant-watchlists/utils";
import { mapData } from "./utils";

const FMarket = () => {
  const config = useConfigStore((state) => state.config);
  const selectedWatchlist = useFireantStore((state) => state.selectedWatchlist);

  const [rawData, setRawData] = useState<RawData>([]);
  const [rows, setRows] = useState<any>([]);
  const [options] = useState<Highcharts.Options>(getDefaultOptions());

  useEffect(() => {
    (async () => {
      try {
        const res = await FMarketService.getNavHistory();

        const mappedRes = mapData(res);
        setRawData(mappedRes);

        setRows(mappedRes);
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    })();
  }, [selectedWatchlist, config.category, config.timeRange]);

  return (
    <Box>
      <ConfigOption />

      <Box mt={2} sx={{ height: 500 }}>
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
          <Box
            sx={{
              height: "600px",
              "& .color-red": {
                color: "rgb(238, 84, 66)",
              },
              "& .color-green": {
                color: "rgb(0, 170, 0)",
              },
              "& .color-unset": {
                color: "unset",
              },
              "& .color-yellow": {
                color: "rgb(204, 170, 0)",
              },
            }}
          >
            <Table columns={columns} rows={rows} />
          </Box>
        )}
        {config.displayType === "chart" && (
          <HighchartsReact highcharts={Highcharts} options={options} />
        )}
      </Box>
    </Box>
  );
};

export default FMarket;

const columns: GridColDef[] = [
  { field: "id", headerName: "id", width: 100, groupable: false },
  {
    field: "nav",
    headerName: "nav",
    minWidth: 120,
    align: "right",
    renderCell: (params) => {
      return params.value ? formatNumber(Number(params.value.toFixed(0))) : "-";
    },
  },
  {
    field: "navChange",
    headerName: "navChange",
    minWidth: 120,
    align: "right",
    renderCell: (params) => {
      return params.value ? formatNumber(Number(params.value.toFixed(0))) : "-";
    },
  },
  {
    field: "navChangePercent",
    headerName: "navChangePercent",
    minWidth: 120,
    align: "right",
    cellClassName: (params) => {
      return getCellClassName(params.row.navChange);
    },
    renderCell: (params) => {
      return params.value ? formatNumber(Number(params.value.toFixed(2))) : "-";
    },
  },
  {
    field: "navDate",
    headerName: "navDate",
    minWidth: 120,
  },
  {
    field: "navAll",
    headerName: "navAll",
    minWidth: 120,
    renderCell: (params) => {
      return params.value ? formatNumber(Number(params.value.toFixed(2))) : "-";
    },
  },
  {
    field: "navFirstOfMonth",
    headerName: "navFirstOfMonth",
    minWidth: 120,
    renderCell: (params) => {
      return params.value ? formatNumber(Number(params.value.toFixed(2))) : "-";
    },
  },
  {
    field: "navLastOfMonth",
    headerName: "navLastOfMonth",
    minWidth: 120,
    renderCell: (params) => {
      return params.value ? formatNumber(Number(params.value.toFixed(2))) : "-";
    },
  },
];
