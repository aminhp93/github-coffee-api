import {
  FundamentalResponse,
  HistoricalPriceResponse,
} from "@/@core/services/fireant/schema";

export type PromiseResponse = {
  symbol: string;
  fundamentalData?: FundamentalResponse;
  historicalPriceData?: HistoricalPriceResponse;
};

export type HandleClickSymbol = (symbol: string) => void;
