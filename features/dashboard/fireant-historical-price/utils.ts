/* eslint-disable @typescript-eslint/no-explicit-any */
export const getRows = (data: any) => {
  return data.map((i: any) => {
    return {
      ...i,
      id: i.date,
    };
  });
};

export const formatNumberColumn = (
  value: number,
  divider = DIVIDER.billion
) => {
  // divide by 1 billion
  const divived_value = value / divider;
  // divived_value is like 12345,67. Format it like 12,345
  return divived_value.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
};

export const DIVIDER = {
  billion: 1_000_000_000,
  million: 1_000_000,
};
