import { ListResponseItem } from "@/@core/services/one-housing/OneHousing.schema";

export const getRows = (data: ListResponseItem[]) => {
  // data is array of object like [{postId: '1', originalContent: 'xxx'}, {postId: '2', originalContent: 'yyy'}]
  // i want to convert it to array of object like [{groupedSymbol: 'AAPL', postId: '1', originalContent: 'xxx'}, {groupedSymbol: 'AAPL', postId: '2', originalContent: 'yyy'}]

  return data;
};
