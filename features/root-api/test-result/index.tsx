/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { Button, Box } from "@mui/material";
import { LIST_API } from "@/features/root-api/constants";
import { TOKEN } from "@/@core/services/fireant/constants";
import { useRequestStore } from "../store/request";
import { getRequest } from "@/@core/services/utils";

type PromiseItem = {
  url: string;
  promise: Promise<any>; // Replace 'any' with the actual type if you know it
};

export default function TestResult() {
  const setAllResponses = useRequestStore((s) => s.setAllResponses);
  const clearStore = useRequestStore((s) => s.clearStore);

  const handleTest = () => {
    const listPromise: PromiseItem[] = [];

    LIST_API.forEach((item) => {
      let token: undefined | string = undefined;
      if (item.id === "fireant") {
        token = TOKEN;
      }

      item.request.forEach((req) => {
        listPromise.push({
          url: req.url,
          promise: axios(getRequest(token, req.url)!),
        });
      });
    });

    Promise.all(
      listPromise.map((item: PromiseItem) => {
        return item.promise
          .then((res: any) => ({ ...res, url: item.url, status: "success" }))
          .catch((err: any) => ({ ...err, url: item.url, status: "failed" }));
      })
    )
      .then((res) => {
        setAllResponses(res);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
      });
  };

  const handleClearStore = () => {
    clearStore();
  };

  return (
    <Box>
      <Button onClick={handleTest}>Test all</Button>
      <Button onClick={handleClearStore}>Clear store</Button>
    </Box>
  );
}
