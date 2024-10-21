import { Display, TimeRange, Category } from "./types";
import { create } from "zustand";
import { produce } from "immer";

type Config = {
  displayType: Display;
  timeRange: TimeRange;
  category: Category;
};

type ConfigStore = {
  config: Config;
  setConfig: (data: Config) => void;
};

const useConfigStore = create<ConfigStore>((set) => ({
  config: {
    displayType: "raw-data",
    timeRange: "1w",
    category: "fireant-watchlists",
  },
  setConfig: (data) =>
    set(
      produce((state) => {
        state.config = data;
      })
    ),
}));

export default useConfigStore;
