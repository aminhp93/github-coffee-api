import { PromiseResponse } from "./types";
import { HistoricalPriceResponse } from "@/@core/services/fireant/schema";
import { GridColDef } from "@mui/x-data-grid-premium";

import {
  HIDDEN_FIELDS,
  DAYS_IN_WEEK,
  DAYS_IN_MONTH,
  BASE_COLUMNS,
  HISTORICAL_PRICE_COLUMNS,
  FUNDAMENTAL_COLUMNS,
} from "./constants";
import { HandleClickSymbol } from "./types";

const getChangeAverageVolume5Days = (data: HistoricalPriceResponse) => {
  // current volume
  const currentVolume = data[0].totalVolume;
  // 5 days average volume
  const averageVolume5days =
    data.slice(0, 5).reduce((acc, cur) => acc + cur.totalVolume, 0) / 5;
  // change in average volume
  return Number(
    (((currentVolume - averageVolume5days) / averageVolume5days) * 100).toFixed(
      2
    )
  );
};

const getChangePrice = (data: HistoricalPriceResponse, numberOfDay: number) => {
  // current price
  const currentPrice = data[0].priceClose;
  const price1Week = data[numberOfDay].priceClose;
  // change in price
  return Number(((currentPrice - price1Week) / price1Week) * 100).toFixed(2);
};

const getNumberPutThrough = (
  data: HistoricalPriceResponse,
  numberOfDay: number
) => {
  let count = 0;
  for (let i = 0; i < numberOfDay; i++) {
    if (data[i].putthroughValue) {
      count++;
    }
  }
  return count;
};

export const mapData = (result: PromiseResponse[]) => {
  // eslint-disable-next-line no-console
  console.log("result", result);
  const mappedRes = result.map((i) => {
    // Validate data
    if (!i.historicalPriceData || !i.fundamentalData)
      return { id: i.symbol, symbol: i.symbol };

    // Historical price
    const i_0 = i.historicalPriceData[0];
    const i_1 = i.historicalPriceData[1];
    const priceChange = Number((i_0.priceClose - i_0.priceBasic).toFixed(2));
    const pricePercentChange = Number(
      ((priceChange / i_0.priceBasic) * 100).toFixed(2)
    );
    const gapOpen = Number(i_0.priceLow - i_1.priceHigh).toFixed(2);
    const totalVolume = i_0.totalVolume;
    const changeAverageVolume5days = getChangeAverageVolume5Days(
      i.historicalPriceData
    );
    const changePrice1Week = getChangePrice(
      i.historicalPriceData,
      DAYS_IN_WEEK
    );
    const changePrice1Month = getChangePrice(
      i.historicalPriceData,
      DAYS_IN_MONTH
    );
    // count the number of put through trades in the last week
    const numberPutThrough1Week = getNumberPutThrough(
      i.historicalPriceData,
      DAYS_IN_WEEK
    );
    const numberPutThrough1Month = getNumberPutThrough(
      i.historicalPriceData,
      DAYS_IN_MONTH
    );

    // Fundamental
    const marketCap = i.fundamentalData?.marketCap;
    const pe = i.fundamentalData?.pe;
    const eps = i.fundamentalData?.eps;

    return {
      ...i_0,
      // Historical price
      id: i_0.symbol,
      priceChange,
      pricePercentChange,
      gapOpen,
      totalVolume,
      changeAverageVolume5days,
      changePrice1Week,
      changePrice1Month,
      numberPutThrough1Week,
      numberPutThrough1Month,
      // Fundamental
      marketCap,
      pe,
      eps,
    };
  });
  return mappedRes;
};

export const formatNumber = (number: number) => {
  return new Intl.NumberFormat().format(number);
};

export const getCellClassName = (data: number) => {
  if (data === 0) return "color-yellow";
  if (data > 0) return "color-green";
  if (data < 0) return "color-red";
  return "color-unset";
};

type ColumnVisibilityModel = {
  [key: string]: boolean;
};

const xxx = (columns: GridColDef[], list?: string[]): ColumnVisibilityModel => {
  const result: ColumnVisibilityModel = {};

  columns
    .map((i) => i.field)
    .map((i) => {
      if (HIDDEN_FIELDS.includes(i)) {
        result[i] = false;
      } else {
        if (list) {
          result[i] = list.includes(i);
        } else {
          result[i] = true;
        }
      }
    });
  return result;
};

export const getFields = (
  columns: GridColDef[]
): {
  [key: string]: ColumnVisibilityModel;
} => {
  return {
    all: xxx(columns),
    dailyUse: xxx(columns, ["symbol", "pricePercentChange"]),
    check: xxx(columns, [
      "symbol",
      "eps",
      "pe",
      "numberPutThrough1Week",
      "numberPutThrough1Month",
    ]),
  };
};

export const getColumns = (onClickSymbol: HandleClickSymbol) => {
  return [
    ...BASE_COLUMNS(onClickSymbol),
    ...HISTORICAL_PRICE_COLUMNS,
    ...FUNDAMENTAL_COLUMNS,
  ];
};
