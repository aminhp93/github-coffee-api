import axios from "axios";
import { SearchResponse, StoriesResponse } from "./schema";
import { DevToUrls, SortBy, FeedType } from "./constants";

export const baseURL = "https://dev.to";

const httpFireantService = axios.create({
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${TOKEN}`,
  },
  baseURL,
});

// add intercepter httpFireantService response is res.data
httpFireantService.interceptors.response.use((res) => {
  return res.data;
});

const DevToService = {
  search: (
    page: number = 1,
    sortBy: SortBy = "published_at"
  ): Promise<SearchResponse> =>
    httpFireantService({
      url: DevToUrls.search(page, sortBy),
    }),
  stories: (
    page: number = 1,
    feedType: FeedType = "latest"
  ): Promise<StoriesResponse> =>
    httpFireantService({
      url: DevToUrls.stories(page, feedType),
    }),
};

export default DevToService;
