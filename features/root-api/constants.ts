import { Request } from "@/features/root-api/request/types";
import { HistoricalPriceSchema } from "@/@core/services/fireant/schema";

export const LIST_WICHART_API: Request[] = [
  {
    url: "https://wifeed.vn/api/thong-tin-co-phieu/danh-sach-ma-chung-khoan?loaidn=1&san=HOSE",
    name: "Danh sách mã chứng khoán",
    id: 1,
  },
  {
    url: "https://wifeed.vn/api/thong-bao-api/cap-nhat-du-lieu?page=1&limit=100",
    name: "Thông báo cập nhật dữ liệu",
    id: 2,
  },
];

export const LIST_FIREANT_API: Request[] = [
  // {
  //   url: "https://restv2.fireant.vn/symbols/VPB/fundamental",
  //   name: "Fundamental",
  //   id: 1,
  //   parseResponse: FundamentalSchema,
  // },
  // {
  //   url: "https://restv2.fireant.vn/me/watchlists",
  //   name: "Watchlists",
  //   id: 2,
  //   parseResponse: WatchlistSchema,
  // },
  {
    url: "https://restv2.fireant.vn/symbols/VPB/profile",
    name: "Profile",
    id: 3,
  },
  {
    url: "https://restv2.fireant.vn/symbols/VPB/rrg?startDate=2023-02-14&endDate=2024-02-14",
    name: "RRG",
    id: 4,
  },
  // {
  //   url: "https://restv2.fireant.vn/posts?symbol=HHV&type=1&offset=0&limit=20",

  //   name: "Posts",
  //   id: 5,
  // },
  {
    url: "https://restv2.fireant.vn/symbols/VPB/timescale-marks?startDate=2022-11-29&endDate=2037-01-01",
    name: "Timescale Marks",
    id: 6,
  },
  {
    url: "https://restv2.fireant.vn/symbols/VPB/officers",
    name: "Officers",
    id: 7,
  },
  {
    url: "https://restv2.fireant.vn/symbols/VPB/subsidiaries",
    name: "Subsidiaries",
    id: 8,
  },
  {
    url: "https://restv2.fireant.vn/symbols/VPB/holders",
    name: "Holders",
    id: 9,
  },
  {
    url: "https://restv2.fireant.vn/symbols/VPB/dividends?count=4",
    name: "Dividends",
    id: 10,
  },
  {
    url: "https://restv2.fireant.vn/events/search?symbol=VPB&orderBy=1&type=0&startDate=2014-02-14&endDate=2034-02-14&offset=0&limit=20",
    name: "Events",
    id: 11,
  },
  {
    url: "https://restv2.fireant.vn/symbols/VPB/financial-reports?type=BS&period=Q&compact=true&offset=0&limit=5",
    name: "Financial Reports",
    id: 12,
  },
  {
    url: "https://restv2.fireant.vn/symbols/VPB/financial-indicators",
    name: "Financial Indicators",
    id: 13,
  },
  {
    url: "https://restv2.fireant.vn/symbols/VPB/historical-quotes?startDate=2021-02-14&endDate=2024-02-14&offset=0&limit=20",
    name: "Historical Quotes",
    id: 14,
    parseResponse: HistoricalPriceSchema,
  },
];

export const LIST_API = [
  {
    id: "wichart",
    label: "Wichart",
    request: LIST_WICHART_API,
  },
  {
    id: "fireant",
    label: "Fireant",
    request: LIST_FIREANT_API,
  },
];
