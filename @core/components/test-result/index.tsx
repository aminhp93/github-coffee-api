"use client";

import axios from "axios";
import { Button, Box } from "@mui/material";
import {
  LIST_FIREANT_API,
  LIST_WICHART_API,
} from "../../../app/root-api/constants";
import { TOKEN } from "../../services/fireant/Fireant.constants";
import { useRequestStore } from "../../store/request";
import { getRequest } from "../../services/utils";

type PromiseItem = {
  url: string;
  promise: Promise<any>; // Replace 'any' with the actual type if you know it
};

export default function TestResult() {
  const setAllResponses = useRequestStore((s) => s.setAllResponses);
  const clearStore = useRequestStore((s) => s.clearStore);

  const handleTest = () => {
    const listPromise: PromiseItem[] = [];

    [...LIST_WICHART_API, ...LIST_FIREANT_API].forEach((item) => {
      listPromise.push({
        url: item.url,
        promise: axios(getRequest(TOKEN, item?.url)!),
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
