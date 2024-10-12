import { z } from "zod";

// Define the Zod schema for the individual data items
const DataItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  date: z.string(), // Assuming date is in ISO format as a string
  title: z.string(),
  color: z.string(),
});

// Define the Zod schema for the entire data array
export const TimescaleMarksSchema = z.array(DataItemSchema);

export type TimescaleMarksResponse = z.infer<typeof TimescaleMarksSchema>;
