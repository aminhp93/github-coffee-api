import { z } from "zod";

// Define the Zod schema for the individual subsidiary items
const SubsidiarySchema = z.object({
  institutionID: z.number(),
  symbol: z.string().nullable(),
  exchange: z.string().nullable(),
  companyName: z.string(),
  shortName: z.string().nullable(),
  internationalName: z.string(),
  companyProfile: z.string().nullable(),
  type: z.number(),
  ownership: z.number(),
  shares: z.number(),
  isListed: z.boolean(),
  charterCapital: z.number(),
});

// Define the Zod schema for the entire subsidiaries array
export const SubsidiariesSchema = z.array(SubsidiarySchema);

export type SubsidiariesResponse = z.infer<typeof SubsidiariesSchema>;
