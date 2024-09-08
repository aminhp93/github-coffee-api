/* eslint-disable @typescript-eslint/no-unused-vars */

import { z } from "zod";

// Historical Price
const HistoricalPriceItemSchema = z.object({
  date: z.string(), // Assuming date is in ISO format as a string
  symbol: z.string(),
  priceHigh: z.number(),
  priceLow: z.number(),
  priceOpen: z.number(),
  priceAverage: z.number(),
  priceClose: z.number(),
  priceBasic: z.number(),
  totalVolume: z.number(),
  dealVolume: z.number(),
  putthroughVolume: z.number(),
  totalValue: z.number(),
  putthroughValue: z.number(),
  buyForeignQuantity: z.number(),
  buyForeignValue: z.number(),
  sellForeignQuantity: z.number(),
  sellForeignValue: z.number(),
  buyCount: z.number(),
  buyQuantity: z.number(),
  sellCount: z.number(),
  sellQuantity: z.number(),
  adjRatio: z.number(),
  currentForeignRoom: z.number(),
  propTradingNetDealValue: z.number(),
  propTradingNetPTValue: z.number(),
  propTradingNetValue: z.number(),
  unit: z.number(),
});

const HistoricalPriceSchema = z.array(HistoricalPriceItemSchema);

export type HistoricalPriceResponse = z.infer<typeof HistoricalPriceSchema>;
