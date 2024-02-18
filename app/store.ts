import { create } from "zustand";
import { produce } from "immer";
import { RequestType } from "./schema";

export type RequestStore = {
  request: RequestType | null;
  setRequest: (data: RequestType) => void;
  response: any;
  setResponse: (data: any) => void;
  allResponses: any;
  setAllResponses: (data: any) => void;
  clearStore: () => void;
};

export const useRequestStore = create<RequestStore>((set) => ({
  request: null,
  setRequest: (data) =>
    set(
      produce((state) => {
        state.request = data;
        if (data) {
          state.allResponses = [];
        }
      })
    ),
  response: null,
  setResponse: (data) =>
    set(
      produce((state) => {
        state.response = data;
      })
    ),
  allResponses: [],
  setAllResponses: (data) =>
    set(
      produce((state) => {
        state.allResponses = data;
      })
    ),
  clearStore: () =>
    set(
      produce((state) => {
        state.allResponses = [];
        state.request = null;
        state.response = null;
      })
    ),
}));
