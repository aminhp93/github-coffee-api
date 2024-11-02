import { z } from "zod";

// Define the Zod schema for the individual officer items
const OfficerSchema = z.object({
  officerID: z.number(),
  individualID: z.number(),
  name: z.string(),
  positionID: z.number(),
  position: z.string(),
  isForeigner: z.boolean(),
});

// Define the Zod schema for the entire officers array
export const OfficersSchema = z.array(OfficerSchema);

export type OfficersResponse = z.infer<typeof OfficersSchema>;
