import { z } from "zod";

// Define the Zod schema for the individual dividend items
const DividendSchema = z.object({
  year: z.number(),
  cashDividend: z.number(),
  stockDividend: z.number(),
  totalAssets: z.number(),
  stockHolderEquity: z.number(),
});

// Define the Zod schema for the entire dividends array
export const DividendsSchema = z.array(DividendSchema);

export type DividendsResponse = z.infer<typeof DividendsSchema>;
