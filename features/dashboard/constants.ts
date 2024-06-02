import {
  DataObject,
  TableRows,
  ShowChart,
  Newspaper,
} from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid-premium";
import { Category } from "./types";

export const DATA = [
  [1262304000000, 0.7537],
  [1262563200000, 0.6951],
  [1262649600000, 0.6925],
  [1262736000000, 0.697],
  [1262822400000, 0.6992],
  [1262908800000, 0.7007],
  [1263168000000, 0.6884],
  [1263254400000, 0.6907],
  [1263340800000, 0.6868],
  [1263427200000, 0.6904],
];

export const LIST_DISPLAY = [
  {
    value: "raw-data",
    label: DataObject,
  },
  {
    value: "table",
    label: TableRows,
  },
  {
    value: "chart",
    label: ShowChart,
  },
];

export const LIST_CATEGORY = [
  {
    value: "fireant-post",
    label: Newspaper,
  },
  {
    value: "fireant-news",
    label: Newspaper,
  },
  {
    value: "github",
    label: Newspaper,
  },
  {
    value: "dev-to",
    label: Newspaper,
  },
];

export const LIST_TIME_RANGE = [
  // {
  //   value: "1d",
  //   label: "1d",
  // },
  {
    value: "1w",
    label: "1w",
  },
  {
    value: "1m",
    label: "1m",
  },
  // {
  //   value: "3m",
  //   label: "3m",
  // },
  // {
  //   value: "6m",
  //   label: "6m",
  // },
  // {
  //   value: "1y",
  //   label: "1y",
  // },
  // {
  //   value: "all",
  //   label: "all",
  // },
];

export const FireantColumns: GridColDef[] = [
  { field: "groupedSymbol", headerName: "Grouped Symbol", width: 150 },
  { field: "postId", headerName: "postId", width: 100, groupable: false },
  {
    field: "originalContent",
    headerName: "originalContent",
    width: 100,
    groupable: false,
  },
];

export const DevToColumns: GridColDef[] = [
  { field: "groupedDate", headerName: "Grouped Date", width: 150 },
  { field: "id", headerName: "id", width: 100, groupable: false },
  { field: "title", headerName: "title", width: 100, groupable: false },
];

export const CONFIG: {
  [key: string]: {
    columns: GridColDef[];
    initialStateConfig: any;
  };
} = {
  "fireant-post": {
    columns: FireantColumns,
    initialStateConfig: {
      rowGrouping: {
        model: ["groupedSymbol"],
      },
    },
  },
  "fireant-news": {
    columns: FireantColumns,
    initialStateConfig: {
      rowGrouping: {
        model: ["groupedSymbol"],
      },
    },
  },
  "dev-to": {
    columns: DevToColumns,
    initialStateConfig: {
      rowGrouping: {
        model: ["groupedDate"],
      },
    },
  },
};
