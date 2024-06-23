import { StoriesItem } from "@/@core/services/dev-to/DevTo.schema";

export const mapData = (data: StoriesItem[]) => {
  // group all data have same day like 2021-10-10
  const xxx = data.reduce((acc, item) => {
    const date = new Date(item.published_at_int * 1000)
      .toISOString()
      .split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, StoriesItem[]>);

  return Object.keys(xxx).map((key) => {
    return [Date.parse(key), xxx[key].length];
  });
};
