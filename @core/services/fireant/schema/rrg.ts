import { z } from "zod";

export const RrgItemSchema = z.object({
  date: z.string(), // Assuming date is in ISO format as a string
  rs: z.number(),
  rm: z.number(),
});

export const RrgSchema = z.array(RrgItemSchema);

export type RrgResponse = z.infer<typeof RrgSchema>;
