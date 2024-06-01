import axios from "axios";
import { TOKEN, DEFAULT_OFFSET, DEFAULT_LIMIT } from "./Fireant.constants";

import {
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

const FireantUrls = {
  fundamental: (symbol: string) => `/${symbol}/fundamental`,
  news: (symbol: string, offset: number, limit: number) =>
    `posts?symbol=${symbol}&type=1&offset=${offset}&limit=${limit}`,
  posts: (symbol: string, offset: number, limit: number) =>
    `/posts?symbol=${symbol}&type=0&offset=${offset}&limit=${limit}`,

  watchlists: "/me/watchlists",
};

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
      url: FireantUrls.posts(symbol, offset, limit),
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
