/* eslint-disable @typescript-eslint/no-explicit-any */

import { RawData } from "./types";
import { PostsItem } from "@/@core/services/fireant/schema";

export const mapData = (data: PostsItem[]) => {
  // group all data have same day like 2021-10-10
  const xxx = data.reduce(
    (acc, item) => {
      const date = new Date(item.date).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    },
    {} as Record<string, PostsItem[]>
  );

  return Object.keys(xxx).map((key) => {
    return [Date.parse(key), xxx[key].length];
  });
};

export const getRows = (data: RawData) => {
  // data is array of object like [{symbol: 'AAPL', data: [{ postId: '1', originalContent: 'xxx' }, { postId: '2', originalContent: 'yyy' }]}]
  // i want to convert it to array of object like [{groupedSymbol: 'AAPL', postId: '1', originalContent: 'xxx'}, {groupedSymbol: 'AAPL', postId: '2', originalContent: 'yyy'}]

  const result = data.reduce((acc: any, item: any) => {
    const symbol = item.symbol;
    const data = item.data;
    const mappedData = data.map((i: any) => {
      return {
        groupedSymbol: symbol,
        id: `${symbol}-${i.postID}`,
        ...i,
      };
    });
    return [...acc, ...mappedData];
  }, [] as any);
  return result;
};
