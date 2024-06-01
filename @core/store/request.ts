import { create } from "zustand";
import { produce } from "immer";
import { Request } from "../components/request/types";
import { Response } from "../components/response/types";

export type RequestStore = {
  request: Request | null;
  setRequest: (data: Request) => void;
  response: Response | null;
  setResponse: (data: Response) => void;
  allResponses: Response[];
  setAllResponses: (data: Response[]) => void;
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
