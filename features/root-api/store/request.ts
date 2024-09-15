import { create } from "zustand";
import { produce } from "immer";
import { Request } from "../request/types";
import { Response } from "../response/types";
import axios from "axios";
import { getRequest } from "@/@core/services/utils";

import { useEffect } from "react";
import { TOKEN } from "@/@core/services/fireant/constants";
import { LIST_API } from "../constants";

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

export const useGetRequest = () => {
  const request = useRequestStore((s) => s.request);
  const setResponse = useRequestStore((s) => s.setResponse);

  useEffect(() => {
    if (!request) return;

    (async () => {
      try {
        const res = await axios(getRequest(TOKEN, request?.url)!);

        // find item by url
        const found = LIST_API.map((i) => i.request)
          .flat()
          .find((i) => i.url === request.url);

        if (found?.parseResponse) {
          found.parseResponse.parse(res.data);
        }

        const result = {
          ...res,
          url: request.url,
          status: "success" as const,
        };
        setResponse(result);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        const errorResult = { ...err, url: request.url, status: "failed" };
        setResponse(errorResult);
      }
    })();
  }, [request, setResponse]);
};
