import { GridColDef } from "@mui/x-data-grid-premium";
import { formatNumber, getCellClassName } from "./utils";
import { NUMBER } from "@/@core/constants/unit";
import Box from "@mui/material/Box";
import { HandleClickSymbol } from "./types";

const MAX_WIDTH = 200;
export const CHUNK_SIZE = 15;
export const WAIT_TIMEOUT = 500;
export const HIDDEN_FIELDS = ["date", "priceChange"];
export const DAYS_IN_WEEK = 5;
export const DAYS_IN_MONTH = 21;

export const BASE_COLUMNS = (onClickSymbol?: HandleClickSymbol) => {
  return [
    {
      field: "symbol",
      headerName: "Symbol",
      maxWidth: MAX_WIDTH,
      flex: 1,

      renderCell: (params) => {
        return (
          <Box onClick={() => onClickSymbol?.(params.value)}>
            {params.value ? params.value : "-"}
          </Box>
        );
      },
      cellClassName: (params) => {
        return getCellClassName(params);
      },
    },
  ] as GridColDef[];
};

export const HISTORICAL_PRICE_COLUMNS: GridColDef[] = [
  {
    field: "priceChange",
    headerName: "+/-",
    maxWidth: MAX_WIDTH,
    flex: 1,
    align: "right",
    cellClassName: (params) => {
      return getCellClassName(params);
    },
  },
  {
    field: "pricePercentChange",
    headerName: "%",
    flex: 1,
    align: "right",
    cellClassName: (params) => {
      return getCellClassName(params);
    },
    maxWidth: MAX_WIDTH,
  },
  {
    field: "gapOpen",
    headerName: "gapOpen (test)",
    flex: 1,
    align: "right",
    maxWidth: MAX_WIDTH,
  },
  {
    field: "putthroughValue",
    headerName: "putthroughValue (billions)",
    align: "right",
    flex: 1,
    renderCell: (params) => {
      return params.value
        ? formatNumber(Number((params.value / NUMBER.BILLION).toFixed(0)))
        : "-";
    },
    maxWidth: MAX_WIDTH,
  },
  {
    field: "numberPutThrough1Week",
    headerName: "numberPutThrough1Week",
    align: "right",
    flex: 1,
    maxWidth: MAX_WIDTH,
  },
  {
    field: "numberPutThrough1Month",
    headerName: "numberPutThrough1Month",
    align: "right",
    flex: 1,
    maxWidth: MAX_WIDTH,
  },

  {
    field: "totalValue",
    headerName: "Value (B)",
    align: "right",
    flex: 1,
    renderCell: (params) => {
      return params.value
        ? formatNumber(Number((params.value / NUMBER.BILLION).toFixed(0)))
        : "-";
    },
    maxWidth: MAX_WIDTH,
  },
  {
    field: "totalVolume",
    headerName: "totalVolume",
    align: "right",
    flex: 1,
    renderCell: (params) => {
      return params.value ? formatNumber(Number(params.value.toFixed(0))) : "-";
    },
    maxWidth: MAX_WIDTH,
  },
  {
    field: "changeAverageVolume5days",
    headerName: "changeAverageVolume5days",
    align: "right",
    flex: 1,
    maxWidth: MAX_WIDTH,
  },
  {
    field: "changePrice1Week",
    headerName: "changePrice1Week",
    align: "right",
    flex: 1,
    maxWidth: MAX_WIDTH,
  },
  {
    field: "changePrice1Month",
    headerName: "changePrice1Month",
    align: "right",
    flex: 1,
    maxWidth: MAX_WIDTH,
  },
  {
    field: "date",
    headerName: "date",
    flex: 1,
    maxWidth: MAX_WIDTH,
  },
];

export const FUNDAMENTAL_COLUMNS: GridColDef[] = [
  {
    field: "marketCap",
    headerName: "marketCap (billions)",
    align: "right",
    maxWidth: MAX_WIDTH,
    flex: 1,
    renderCell: (params) => {
      return params.value
        ? formatNumber(Number((params.value / NUMBER.BILLION).toFixed(0)))
        : "-";
    },
  },
  {
    field: "eps",
    maxWidth: MAX_WIDTH,
    headerName: "eps",
    flex: 1,
    align: "right",
    renderCell: (params) => {
      return params.value ? formatNumber(params.value.toFixed(0)) : "-";
    },
  },
  {
    field: "pe",
    maxWidth: MAX_WIDTH,
    headerName: "pe",
    flex: 1,
    align: "right",
    renderCell: (params) => {
      return params.value ? formatNumber(params.value.toFixed(0)) : "-";
    },
  },
];
