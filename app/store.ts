import { create } from "zustand";
import { produce } from "immer";
import { RequestType, ResponseType } from "./schema";

export interface ParsedResponse extends ResponseType {
  url: string;
  status: "success" | "failed";
}

export type RequestStore = {
  request: RequestType | null;
  setRequest: (data: RequestType) => void;
  response: ResponseType | null;
  setResponse: (data: ResponseType) => void;
  allResponses: ParsedResponse[];
  setAllResponses: (data: ParsedResponse[]) => void;
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
