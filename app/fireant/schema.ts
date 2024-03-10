import { z } from "zod";

export const FundamentalSchema = z.object({
  symbol: z.null(),
  companyType: z.number(),
  sharesOutstanding: z.number(),
  freeShares: z.number(),
  beta: z.number(),
  dividend: z.number(),
  dividendYield: z.number(),
  marketCap: z.number(),
  low52Week: z.number(),
  high52Week: z.number(),
  priceChange1y: z.number(),
  avgVolume10d: z.number(),
  avgVolume3m: z.number(),
  pe: z.number(),
  eps: z.number(),
  sales_TTM: z.number(),
  netProfit_TTM: z.number(),
  insiderOwnership: z.number(),
  institutionOwnership: z.number(),
  foreignOwnership: z.number(),
});

export const WatchlistSchema = z.array(
  z.object({
    watchlistID: z.number(),
    name: z.string(),
    userName: z.string(),
    symbols: z.array(z.string()),
    displayIndex: z.number(),
  })
);

export type FundamentalType = z.infer<typeof FundamentalSchema>;
export type WatchlistType = z.infer<typeof WatchlistSchema>;
