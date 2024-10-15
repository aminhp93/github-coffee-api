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
  },
  {
    field: "putthroughValue",
    headerName: "putthroughValue (B)",
    align: "right",
    flex: 1,
    renderCell: (params) => {
      return params.value
        ? formatNumber(Number((params.value / NUMBER.BILLION).toFixed(0)))
        : "-";
    },
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
  },
  {
    field: "totalVolume",
    headerName: "Vol",
    align: "right",
    flex: 1,
    renderCell: (params) => {
      return params.value ? formatNumber(Number(params.value.toFixed(0))) : "-";
    },
  },

  {
    field: "changeAverageVolume5days",
    headerName: "% Vol 5D",
    align: "right",
    flex: 1,
  },
  {
    field: "changePrice1Week",
    headerName: "% Price 1W",
    align: "right",
    flex: 1,
  },
  {
    field: "changePrice1Month",
    headerName: "% Price 1M",
    align: "right",
    flex: 1,
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
    headerName: "marketCap (B)",
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

export const LIST_FIELDS = COLUMNS.map((i) => i.field);
const HIDDEN_FIELDS = ["date", "priceChange"];

const xxx = (list?: string[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = {};
  LIST_FIELDS.map((i) => {
    if (HIDDEN_FIELDS.includes(i)) {
      result[i] = false;
    } else {
      if (list) {
        result[i] = list.includes(i);
      } else {
        result[i] = true;
      }
    }
  });
  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FIELDS: any = {
  all: xxx(),
  dailyUse: xxx(["symbol", "pricePercentChange"]),
  check: xxx(["symbol", "eps", "pe"]),
};
