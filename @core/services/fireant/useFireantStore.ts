import { create } from "zustand";
import { produce } from "immer";
import { Watchlists, WatchlistItem } from "./schema";

type FireantStore = {
  selectedSymbol?: string;
  setSelectedSymbol: (data: string) => void;
  watchlists: Watchlists;
  selectedWatchlist?: WatchlistItem;
  setWatchlists: (data: Watchlists) => void;
  setSelectedWatchlist: (data: WatchlistItem) => void;
};

const useFireantStore = create<FireantStore>((set) => ({
  selectedSymbol: "VPB",
  setSelectedSymbol: (data) =>
    set(
      produce((state) => {
        state.selectedSymbol = data;
      })
    ),
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
