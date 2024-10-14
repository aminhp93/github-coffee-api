import { GridColDef } from "@mui/x-data-grid-premium";
import { formatNumber, getCellClassName } from "./utils";
import { NUMBER } from "@/@core/constants/unit";

export const BASE_COLUMNS: GridColDef[] = [
  {
    field: "symbol",
    headerName: "Symbol",
    flex: 1,
    cellClassName: (params) => {
      return getCellClassName(params);
    },
  },
];

export const HISTORICAL_PRICE_COLUMNS: GridColDef[] = [
  {
    field: "priceChange",
    headerName: "+/-",
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
  },
  {
    field: "gapOpen",
    headerName: "gapOpen (test)",
    flex: 1,
    align: "right",
    cellClassName: (params) => {
      return getCellClassName(params);
    },
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
    cellClassName: (params) => {
      return getCellClassName(params);
    },
  },
  {
    field: "totalVolume",
    headerName: "totalVolume",
    align: "right",
    flex: 1,
    renderCell: (params) => {
      return params.value ? formatNumber(Number(params.value.toFixed(0))) : "-";
    },
    cellClassName: (params) => {
      return getCellClassName(params);
    },
  },
  {
    field: "changeAverageVolume5days",
    headerName: "changeAverageVolume5days",
    align: "right",
    flex: 1,
    cellClassName: (params) => {
      return getCellClassName(params);
    },
  },
  {
    field: "changePrice1Week",
    headerName: "changePrice1Week",
    align: "right",
    flex: 1,
    cellClassName: (params) => {
      return getCellClassName(params);
    },
  },
  {
    field: "changePrice1Month",
    headerName: "changePrice1Month",
    align: "right",
    flex: 1,
    cellClassName: (params) => {
      return getCellClassName(params);
    },
  },
  {
    field: "date",
    headerName: "date",
    flex: 1,
  },
];

export const FUNDAMENTAL_COLUMNS: GridColDef[] = [
  {
    field: "marketCap",
    headerName: "marketCap (billions)",
    align: "right",
    flex: 1,
    renderCell: (params) => {
      return params.value
        ? formatNumber(Number((params.value / NUMBER.BILLION).toFixed(0)))
        : "-";
    },
  },
  {
    field: "eps",
    headerName: "eps",
    flex: 1,
    align: "right",
    renderCell: (params) => {
      return params.value ? formatNumber(params.value.toFixed(0)) : "-";
    },
  },
  {
    field: "pe",
    headerName: "pe",
    flex: 1,
    align: "right",
    renderCell: (params) => {
      return params.value ? formatNumber(params.value.toFixed(0)) : "-";
    },
  },
];

export const CHUNK_SIZE = 15;
export const WAIT_TIMEOUT = 500;

export const COLUMNS = [
  ...BASE_COLUMNS,
  ...HISTORICAL_PRICE_COLUMNS,
  ...FUNDAMENTAL_COLUMNS,
];
