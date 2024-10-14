import { GridCellParams } from "@mui/x-data-grid-premium";
import { PromiseResponse } from "./types";
import { HistoricalPriceResponse } from "@/@core/services/fireant/schema";

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

const getChangePrice1Week = (data: HistoricalPriceResponse) => {
  // current price
  const currentPrice = data[0].priceClose;
  // 1 week ago price
  const price1Week = data[5].priceClose;
  // change in price
  return Number(((currentPrice - price1Week) / price1Week) * 100).toFixed(2);
};

const getChangePrice1Month = (data: HistoricalPriceResponse) => {
  // current price
  const currentPrice = data[0].priceClose;
  // 1 month ago price
  const price1Month = data[21].priceClose;
  // change in price
  return Number(((currentPrice - price1Month) / price1Month) * 100).toFixed(2);
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
    const changePrice1Week = getChangePrice1Week(i.historicalPriceData);
    const changePrice1Month = getChangePrice1Month(i.historicalPriceData);

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

export const getCellClassName = (params: GridCellParams) => {
  const xxx = params.row.priceChange;
  if (xxx > 0) return "color-green";
  if (xxx < 0) return "color-red";
  return "color-unset";
};
