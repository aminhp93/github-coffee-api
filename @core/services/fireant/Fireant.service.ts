import { FundamentalResponse } from "./Fireant.schema";
import httpService from "../httpService";

const FireantUrl = {
  Fundamental: (symbol: string) => `symbols/${symbol}/fundamental`,
  Watchlists: "me/watchlists",
  Posts: (symbol: string) => `posts?symbol=${symbol}&type=1&offset=0&limit=20`,
};

const BASE_URL = "https://restv2.fireant.vn/";

const FireantService = {
  Fundamental: (symbol: string): Promise<FundamentalResponse> => {
    return httpService({
      method: "GET",
      url: BASE_URL + FireantUrl.Fundamental(symbol),
    });
  },
  Watchlists: () => {
    return httpService({
      method: "GET",
      url: BASE_URL + FireantUrl.Watchlists,
    });
  },
  Posts: (symbol: string): Promise<any> => {
    return httpService({
      method: "GET",
      url: BASE_URL + FireantUrl.Posts(symbol),
    });
  },
};

export default FireantService;
