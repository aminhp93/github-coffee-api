import { z } from "zod";

const Item = z.object({
  watchlistID: z.number(),
  name: z.string(),
  userName: z.string(),
  symbols: z.array(z.string()),
  displayIndex: z.number(),
});

export const WatchlistsSchema = z.array(Item);

export type WatchlistsResponse = z.infer<typeof WatchlistsSchema>;

export type WatchlistItem = z.infer<typeof Item>;
export type Watchlists = WatchlistsResponse;
