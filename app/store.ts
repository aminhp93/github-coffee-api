import { create } from "zustand";
import { produce } from "immer";
import { RequestType } from "./schema";

export type RequestStore = {
  request: RequestType | null;
  setRequest: (data: RequestType) => void;
};

export const useRequestStore = create<RequestStore>((set) => ({
  request: null,
  setRequest: (data) =>
    set(
      produce((state) => {
        state.request = data;
      })
    ),
}));
