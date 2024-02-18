"use client";

import axios from "axios";
import { Button, Box } from "@mui/material";
import { LIST_FIREANT_API, LIST_WICHART_API, TOKEN } from "../constants";
import { useRequestStore } from "../store";
import { getRequest } from "../utils";

export default function Home() {
  const setAllResponses = useRequestStore((s) => s.setAllResponses);
  const clearStore = useRequestStore((s) => s.clearStore);

  const handleTest = () => {
    const listPromise: any = [];

    [...LIST_WICHART_API, ...LIST_FIREANT_API].forEach((item) => {
      listPromise.push({
        url: item.url,
        promise: axios(getRequest(TOKEN, item)!),
      });
    });

    Promise.all(
      listPromise.map((item: any) => {
        return item.promise
          .then((res: any) => ({ ...res, url: item.url, status: "success" }))
          .catch((err: any) => ({ ...err, url: item.url, status: "failed" }));
      })
    )
      .then((res) => {
        console.log(res); // This will now log an array of objects, each containing the response/error, the URL of the request, and the status ('success' or 'failed')
        setAllResponses(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClearStore = () => {
    clearStore();
  };

  return (
    <Box>
      <Button onClick={handleTest}>Test reqsult</Button>
      <Button onClick={handleClearStore}>Clear store</Button>
    </Box>
  );
}
