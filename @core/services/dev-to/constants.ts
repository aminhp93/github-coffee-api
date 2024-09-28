type SortDirection = "asc" | "desc";

export type SortBy =
  | "hotness_score"
  | "public_reactions_count"
  | "published_at";

export type FeedType =
  | "latest"
  | "week"
  | "month"
  | "year"
  | "infinity"
  | undefined;

export const DevToUrls: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: (...args: any[]) => string;
} = {
  search: (
    page: number = 1,
    sortBy: SortBy = "published_at",
    pageSize: number = 100,
    sortDirection: SortDirection = "desc",
    className: string = "Article",
    publishedAt?: string
  ) =>
    `/search/feed_content?per_page=${pageSize}&page=${page}&sort_by=${sortBy}&sort_direction=${sortDirection}&approved=&class_name=${className}&published_at[gte]=${publishedAt}`,
  stories: (page: number = 1, feedType: FeedType = "latest") =>
    `/stories/feed/${feedType ?? ""}?page=${page}`,
};
