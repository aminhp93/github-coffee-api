import { z } from "zod";

export const WatchlistsSchema = z.array(
  z.object({
    watchlistID: z.number(),
    name: z.string(),
    userName: z.string(),
    symbols: z.array(z.string()),
    displayIndex: z.number(),
  })
);

export type WatchlistsResponse = z.infer<typeof WatchlistsSchema>;
