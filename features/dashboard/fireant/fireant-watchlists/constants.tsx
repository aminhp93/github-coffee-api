import { GridColDef } from "@mui/x-data-grid-premium";
import { formatNumber, getCellClassName } from "./utils";
import { NUMBER } from "@/@core/constants/unit";
import Box from "@mui/material/Box";

const MAX_WIDTH = 200;

type HandleClickSymbol = (symbol: string) => void;

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

export const CHUNK_SIZE = 15;
export const WAIT_TIMEOUT = 500;

export const COLUMNS = (onClickSymbol: HandleClickSymbol) => {
  return [
    ...BASE_COLUMNS(onClickSymbol),
    ...HISTORICAL_PRICE_COLUMNS,
    ...FUNDAMENTAL_COLUMNS,
  ];
};

const HIDDEN_FIELDS = ["date", "priceChange"];

type ColumnVisibilityModel = {
  [key: string]: boolean;
};

const xxx = (columns: GridColDef[], list?: string[]): ColumnVisibilityModel => {
  const result: ColumnVisibilityModel = {};

  columns
    .map((i) => i.field)
    .map((i) => {
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

export const getFields = (
  columns: GridColDef[]
): {
  [key: string]: ColumnVisibilityModel;
} => {
  return {
    all: xxx(columns),
    dailyUse: xxx(columns, ["symbol", "pricePercentChange"]),
    check: xxx(columns, ["symbol", "eps", "pe"]),
  };
};
