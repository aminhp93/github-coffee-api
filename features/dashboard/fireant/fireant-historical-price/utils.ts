import { NUMBER } from "@/@core/constants/unit";
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getRows = (data: any) => {
  return data.map((i: any) => {
    return {
      ...i,
      id: i.date,
    };
  });
};

export const formatNumberColumn = (value: number, divider = NUMBER.BILLION) => {
  // divide by 1 billion
  const divived_value = value / divider;
  // divived_value is like 12345,67. Format it like 12,345
  return divived_value.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
};
