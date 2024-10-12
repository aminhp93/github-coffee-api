import { z } from "zod";

// Define the Zod schema for the individual financial indicator items
const FinancialIndicatorSchema = z.object({
  name: z.string(),
  shortName: z.string(),
  description: z.string(),
  group: z.number(),
  groupName: z.string(),
  value: z.number(),
  change: z.number(),
  industryValue: z.number().nullable(),
});

// Define the Zod schema for the entire financial indicators array
export const FinancialIndicatorsSchema = z.array(FinancialIndicatorSchema);

export type FinancialIndicatorsResponse = z.infer<
  typeof FinancialIndicatorsSchema
>;
