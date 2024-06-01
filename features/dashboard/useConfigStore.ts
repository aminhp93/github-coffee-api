import { Display, TimeRange, Company } from "./types";
import { create } from "zustand";
import { produce } from "immer";

type Config = {
  displayType: Display;
  timeRange: TimeRange;
  company: Company;
};

type ConfigStore = {
  config: Config;
  setConfig: (data: Config) => void;
};

const useConfigStore = create<ConfigStore>((set) => ({
  config: {
    displayType: "raw-data",
    timeRange: "1m",
    company: "fireant",
  },
  setConfig: (data) =>
    set(
      produce((state) => {
        state.config = data;
      })
    ),
}));

export default useConfigStore;
