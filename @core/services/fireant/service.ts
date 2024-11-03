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
  FundamentalResponse,
  NewsResponse,
  PostsResponse,
  WatchlistsResponse,
  ProfileResponse,
  RrgResponse,
  HistoricalPriceResponse,
  FinancialReportsResponse,
  TimescaleMarksResponse,
  OfficersResponse,
  SubsidiariesResponse,
  HoldersResponse,
  DividendsResponse,
  EventsResponse,
  FinancialIndicatorsResponse,
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
  profile: (): Promise<ProfileResponse> => {
    return httpFireantService({
      url: FireantUrls.profile(),
    });
  },
  rrg: (): Promise<RrgResponse> => {
    return httpFireantService({
      url: FireantUrls.rrg(),
    });
  },

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
  timescaleMarks: (): Promise<TimescaleMarksResponse> => {
    return httpFireantService({
      url: FireantUrls.timescaleMarks(),
    });
  },
  officers: (): Promise<OfficersResponse> => {
    return httpFireantService({
      url: FireantUrls.officers(),
    });
  },
  subsidiaries: (): Promise<SubsidiariesResponse> => {
    return httpFireantService({
      url: FireantUrls.subsidiaries(),
    });
  },
  holders: (): Promise<HoldersResponse> => {
    return httpFireantService({
      url: FireantUrls.holders(),
    });
  },
  dividends: (): Promise<DividendsResponse> => {
    return httpFireantService({
      url: FireantUrls.dividends(),
    });
  },
  events: (): Promise<EventsResponse> => {
    return httpFireantService({
      url: FireantUrls.events(),
    });
  },
  financialIndicators: (): Promise<FinancialIndicatorsResponse> => {
    return httpFireantService({
      url: FireantUrls.financialIndicators(),
    });
  },
};

export default FireantService;
