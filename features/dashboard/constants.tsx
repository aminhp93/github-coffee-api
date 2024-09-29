/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  DataObject,
  TableRows,
  ShowChart,
  Newspaper,
} from "@mui/icons-material";
import { Category } from "./types";
import FireantWatchlists from "./fireant/fireant-watchlists";
import FireantPost from "./fireant/fireant-post";
import FireantNews from "./fireant/fireant-news";
import FireantFinancialReports from "./fireant/fireant-financial-reports";
import FireantHistoricalPrice from "./fireant/fireant-historical-price";
import Github from "./github";
import OneHousing from "./one-housing";
import DevToSearch from "./dev-to/dev-to-search";
import DevToStories from "./dev-to/dev-to-stories";

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

export const LIST_CATEGORY: {
  value: Category;
  label: any;
  component: any;
}[] = [
  {
    value: "fireant-watchlists",
    label: Newspaper,
    component: FireantWatchlists,
  },
  {
    value: "fireant-post",
    label: Newspaper,
    component: FireantPost,
  },
  {
    value: "fireant-news",
    label: Newspaper,
    component: FireantNews,
  },
  {
    value: "fireant-financial-report",
    label: Newspaper,
    component: FireantFinancialReports,
  },
  {
    value: "fireant-historical-price",
    label: Newspaper,
    component: FireantHistoricalPrice,
  },
  {
    value: "github",
    label: Newspaper,
    component: Github,
  },
  {
    value: "dev-to-search",
    label: Newspaper,
    component: DevToSearch,
  },
  {
    value: "dev-to-stories",
    label: Newspaper,
    component: DevToStories,
  },
  {
    value: "one-housing",
    label: Newspaper,
    component: OneHousing,
  },
];

export const LIST_TIME_RANGE = [
  {
    value: "1w",
    label: "1w",
  },
  {
    value: "1m",
    label: "1m",
  },
];
