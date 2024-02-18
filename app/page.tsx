"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRequestStore } from "./store";
import axios from "axios";
import { Box } from "@mui/material";
import { getRequest } from "./utils";
import { TOKEN } from "./constants";

const Wichart = dynamic(() => import("./@components/wichart"), {
  ssr: false,
});

const Fireant = dynamic(() => import("./@components/fireant"), {
  ssr: false,
});

const Response = dynamic(() => import("./@components/response"), {
  ssr: false,
});

const TestResult = dynamic(() => import("./@components/test-result"), {
  ssr: false,
});

export default function Home() {
  const [data, setData] = useState(null);
  const request = useRequestStore((s) => s.request);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await axios(getRequest(TOKEN, request)!);
        const result = { ...res, url: request!.url, status: "success" };
        setData(result.data);
      } catch (err: any) {
        const errorResult = { ...err, url: request!.url, status: "failed" };
        setData(errorResult);
      }
    };
    if (request) {
      init();
    }
  }, [request]);

  return (
    <Box
      sx={{
        display: "flex",
        gap: "20px",
        padding: "20px",
        height: "100vh",
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0, overflow: "auto", height: "100%" }}>
        <Wichart />
        <hr />
        <Fireant />
      </Box>
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Box sx={{ height: "500px", overflow: "auto" }}>
          <Response
            requestData={getRequest(TOKEN, request)}
            responseData={data}
          />
        </Box>
        <hr />
        <Box>
          <TestResult />
        </Box>
      </Box>
    </Box>
  );
}
