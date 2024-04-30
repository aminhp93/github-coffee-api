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

const FireantUrls = {
  fundamental: (symbol: string) => `/${symbol}/fundamental`,
  posts: (symbol: string, type: number, offset: number, limit: number) =>
    `/posts?symbol=${symbol}&type=${type}&offset=${offset}&limit=${limit}`,
  watchlists: "/me/watchlists",
};

const FireantRequest = {
  fundamental: (symbol: string): Promise<FundamentalResponse> => {
    return httpFireantService({
      url: FireantUrls.fundamental(symbol),
    });
  },
  posts: (
    symbol: string,
    type: number,
    offset: number,
    limit: number
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

export default FireantRequest;
