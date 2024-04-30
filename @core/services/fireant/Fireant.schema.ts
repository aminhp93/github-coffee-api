import z from "zod";

const ItemFundamentalResponseSchema = z.object({
  eventID: z.number(),
  symbol: z.string(),
  name: z.string(),
  title: z.string(),
  recordDate: z.string(),
  registrationDate: z.string(),
  executionDate: z.string(),
  type: z.number(),
});

const FundamentalResponseSchema = z.array(ItemFundamentalResponseSchema);

export type FundamentalResponse = z.infer<typeof FundamentalResponseSchema>;
