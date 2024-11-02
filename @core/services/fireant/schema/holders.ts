import { z } from "zod";

// Define the Zod schema for the individual holder items
const HolderSchema = z.object({
  majorHolderID: z.number(),
  individualHolderID: z.number().nullable(),
  institutionHolderID: z.number().nullable(),
  institutionHolderSymbol: z.string().nullable(),
  institutionHolderExchange: z.string().nullable(),
  name: z.string(),
  position: z.string().nullable(),
  shares: z.number(),
  ownership: z.number(),
  isOrganization: z.boolean(),
  isForeigner: z.boolean(),
  isFounder: z.boolean(),
  reported: z.string(), // Assuming date is in ISO format as a string
});

// Define the Zod schema for the entire holders array
export const HoldersSchema = z.array(HolderSchema);

export type HoldersResponse = z.infer<typeof HoldersSchema>;
