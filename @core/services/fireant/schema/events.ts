import { z } from "zod";

// Define the Zod schema for the individual event items
const EventSchema = z.object({
  eventID: z.number(),
  symbol: z.string(),
  name: z.string(),
  title: z.string(),
  recordDate: z.string(), // Assuming date is in ISO format as a string
  registrationDate: z.string(), // Assuming date is in ISO format as a string
  executionDate: z.string().nullable(), // Assuming date is in ISO format as a string
  type: z.number(),
});

// Define the Zod schema for the entire events array
export const EventsSchema = z.array(EventSchema);

export type EventsResponse = z.infer<typeof EventsSchema>;
