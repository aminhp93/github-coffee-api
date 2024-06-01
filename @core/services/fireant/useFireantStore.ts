import { create } from "zustand";
import { produce } from "immer";
import { Watchlists, WatchlistItem } from "./schema";

type FireantStore = {
  watchlists: Watchlists;
  selectedWatchlist?: WatchlistItem;
  setWatchlists: (data: Watchlists) => void;
  setSelectedWatchlist: (data: WatchlistItem) => void;
};

const useFireantStore = create<FireantStore>((set) => ({
  watchlists: [],
  setWatchlists: (data) =>
    set(
      produce((state) => {
        state.watchlists = data;
      })
    ),
  selectedWatchlist: undefined,
  setSelectedWatchlist: (data) =>
    set(
      produce((state) => {
        state.selectedWatchlist = data;
      })
    ),
}));

export default useFireantStore;
