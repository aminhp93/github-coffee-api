import axios from "axios";
import { ListResponse, ListRequestData } from "./OneHousing.schema";

const httpFireantService = axios.create({
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${TOKEN}`,
  },
  baseURL: "https://api.onehousing.vn/onehousing-channel/v1/",
});

// add intercepter httpFireantService response is res.data
httpFireantService.interceptors.response.use((res) => {
  return res.data;
});

type Sort = "RECOMMENDATION" | "VIEW" | "PUBLISHED_AT";

const OneHousingUrls = {
  list: (page: number = 1, size: number = 100, sort: Sort = "RECOMMENDATION") =>
    `inventories/filter?page=${page}&size=${size}&sort=${sort}`,
};

const OneHousingService = {
  list: (page: number, data: ListRequestData): Promise<ListResponse> =>
    httpFireantService({
      method: "POST",
      url: OneHousingUrls.list(page),
      data,
    }),
};

export default OneHousingService;
