import axios from "axios";
import { NavHistoryResponse } from "./schema";
import { FMarketUrls } from "./constants";

export const baseURL = "https://api.fmarket.vn";

const axiosInstance = axios.create({
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${TOKEN}`,
  },
  baseURL,
});

// add intercepter axiosInstance response is res.data
axiosInstance.interceptors.response.use((res) => {
  return res.data;
});

const FMarketService = {
  getNavHistory: (): Promise<NavHistoryResponse> =>
    axiosInstance({
      url: FMarketUrls.getNavHistory(),
      method: "POST",
      data: {
        fromDate: "",
        isAllData: 1,
        productId: 32,
        toDate: "20241105",
      },
    }),
};

export default FMarketService;
