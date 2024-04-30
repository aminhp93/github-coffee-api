import axios from "axios";
import { TOKEN } from "./Fireant.constants";

import {
  FundamentalResponse,
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
  posts: (
    symbol: string,
    type: number = 1,
    offset: number = 0,
    limit: number = 20
  ) => `/posts?symbol=${symbol}&type=${type}&offset=${offset}&limit=${limit}`,
  watchlists: "/me/watchlists",
};

const FireantService = {
  fundamental: (symbol: string): Promise<FundamentalResponse> => {
    return httpFireantService({
      url: FireantUrls.fundamental(symbol),
    });
  },
  posts: (
    symbol: string,
    type?: number,
    offset?: number,
    limit?: number
  ): Promise<PostsResponse> => {
    return httpFireantService({
      url: FireantUrls.posts(symbol, type, offset, limit),
    });
  },
  watchlists: (): Promise<WatchlistsResponse> => {
    return httpFireantService({
      url: FireantUrls.watchlists,
    });
  },
};

export default FireantService;
