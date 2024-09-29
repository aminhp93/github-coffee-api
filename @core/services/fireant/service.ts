import axios from "axios";
import {
  TOKEN,
  DEFAULT_OFFSET,
  DEFAULT_LIMIT,
  FireantUrls,
  FinancialReportsType,
  Period,
} from "./constants";
import dayjs from "dayjs";

import {
  HistoricalPriceResponse,
  FinancialReportsResponse,
  FundamentalResponse,
  NewsResponse,
  PostsResponse,
  WatchlistsResponse,
} from "./schema";

export const baseURL = "https://restv2.fireant.vn";

const httpFireantService = axios.create({
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
  baseURL,
});

// add intercepter httpFireantService response is res.data
httpFireantService.interceptors.response.use((res) => {
  return res.data;
});

const FireantService = {
  historicalPrice: (
    symbol: string,
    startDate: string = "2021-06-23",
    endDate: string = dayjs().format("YYYY-MM-DD"), // "2024-06-23
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
    limit: number = 5
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
      url: FireantUrls.watchlists(),
    });
  },
};

export default FireantService;
