import axios from "axios";
import { TOKEN, DEFAULT_OFFSET, DEFAULT_LIMIT } from "./Fireant.constants";

import {
  HistoricalPriceResponse,
  FinancialReportsResponse,
  FundamentalResponse,
  NewsResponse,
  PostsResponse,
  WatchlistsResponse,
} from "./schema";

const httpFireantService = axios.create({
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
  baseURL: "https://restv2.fireant.vn",
});

// add intercepter httpFireantService response is res.data
httpFireantService.interceptors.response.use((res) => {
  return res.data;
});

type FinancialReportsType = "IS" | "BS" | "CF";
type Period = "Q" | "Y";

const FireantUrls = {
  // https://restv2.fireant.vn/symbols/VPB/historical-quotes?startDate=2021-06-23&endDate=2024-06-23&offset=0&limit=20
  historicalPrice: (
    symbol: string,
    startDate: string,
    endDate: string,
    offset: number,
    limit: number
  ) =>
    `symbols/${symbol}/historical-quotes?startDate=${startDate}&endDate=${endDate}&offset=${offset}&limit=${limit}`,
  // https://restv2.fireant.vn/symbols/VPB/financial-reports?type=IS&period=Q&compact=true&offset=0&limit=5
  financialReports: (
    symbol: string,
    type: FinancialReportsType,
    period: Period,
    compact: boolean,
    offset: number,
    limit: number
  ) =>
    `/symbols/${symbol}/financial-reports?type=${type}&period=${period}&compact=${compact}&offset=${offset}&limit=${limit}`,
  // https://restv2.fireant.vn/symbols/VPB/fundamental
  fundamental: (symbol: string) => `/${symbol}/fundamental`,
  // https://restv2.fireant.vn/posts?symbol=VPB&type=1&offset=0&limit=5
  news: (symbol: string, offset: number, limit: number) =>
    `posts?symbol=${symbol}&type=1&offset=${offset}&limit=${limit}`,
  // https://restv2.fireant.vn/posts?symbol=VPB&type=0&offset=0&limit=5
  posts: (symbol: string, offset: number, limit: number) =>
    `/posts?symbol=${symbol}&type=0&offset=${offset}&limit=${limit}`,
  // https://restv2.fireant.vn/me/watchlists
  watchlists: "/me/watchlists",
};

const FireantService = {
  historicalPrice: (
    symbol: string,
    startDate: string = "2021-06-23",
    endDate: string = "2024-06-23",
    offset: number = DEFAULT_OFFSET,
    limit: number = DEFAULT_LIMIT
  ): Promise<HistoricalPriceResponse> =>
    httpFireantService({
      url: FireantUrls.historicalPrice(
        symbol,
        startDate,
        endDate,
        offset,
        limit
      ),
    }),
  financialReports: (
    symbol: string,
    type: FinancialReportsType = "IS",
    period: Period = "Q",
    compact: boolean = true,
    offset: number = DEFAULT_OFFSET,
    limit: number = DEFAULT_LIMIT
  ): Promise<FinancialReportsResponse> =>
    httpFireantService({
      url: FireantUrls.financialReports(
        symbol,
        type,
        period,
        compact,
        offset,
        limit
      ),
    }),
  fundamental: (symbol: string): Promise<FundamentalResponse> =>
    httpFireantService({
      url: FireantUrls.fundamental(symbol),
    }),
  news: (
    symbol: string,
    offset: number = DEFAULT_OFFSET,
    limit: number = DEFAULT_LIMIT
  ): Promise<NewsResponse> =>
    httpFireantService({
      url: FireantUrls.news(symbol, offset, limit),
    }),
  posts: (
    symbol: string,
    offset: number = DEFAULT_OFFSET,
    limit: number = DEFAULT_LIMIT
  ): Promise<PostsResponse> => {
    return httpFireantService({
      url: FireantUrls.posts(symbol, offset, limit),
    });
  },
  watchlists: (): Promise<WatchlistsResponse> => {
    return httpFireantService({
      url: FireantUrls.watchlists,
    });
  },
};

export default FireantService;
