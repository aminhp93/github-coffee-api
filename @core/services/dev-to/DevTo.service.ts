import axios from "axios";
import { SearchResponse, StoriesResponse } from "./DevTo.schema";

const httpFireantService = axios.create({
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${TOKEN}`,
  },
  baseURL: "https://dev.to/",
});

// add intercepter httpFireantService response is res.data
httpFireantService.interceptors.response.use((res) => {
  return res.data;
});

type SortBy = "hotness_score" | "public_reactions_count" | "published_at";

type FeedType = "latest" | "week" | "month" | "year" | "infinity" | undefined;

type SortDirection = "asc" | "desc";

const DevToUrls = {
  getSearch: (
    page: number,
    sortBy: SortBy,
    pageSize: number = 100,
    sortDirection: SortDirection = "desc",
    className: string = "Article",
    publishedAt?: string
  ) =>
    `/search/feed_content?per_page=${pageSize}&page=${page}&sort_by=${sortBy}&sort_direction=${sortDirection}&approved=&class_name=${className}&published_at[gte]=${publishedAt}`,
  getStories: (page: number, feedType: FeedType) =>
    `stories/feed/${feedType ?? ""}?page=${page}`,
};

const DevToService = {
  getSearch: (page: number, sortBy: SortBy): Promise<SearchResponse> =>
    httpFireantService({
      url: DevToUrls.getSearch(page, sortBy),
    }),
  getStories: (page: number, feedType: FeedType): Promise<StoriesResponse> =>
    httpFireantService({
      url: DevToUrls.getStories(page, feedType),
    }),
};

export default DevToService;
