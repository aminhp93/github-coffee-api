"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRequestStore } from "./store";
import axios from "axios";
import { Box } from "@mui/material";

const Wichart = dynamic(() => import("./wichart"), {
  ssr: false,
});

const Fireant = dynamic(() => import("./fireant"), {
  ssr: false,
});

const Response = dynamic(() => import("./response"), {
  ssr: false,
});

const TestResult = dynamic(() => import("./test-result"), {
  ssr: false,
});

const token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxOTk4NTY0NjExLCJuYmYiOjE2OTg1NjQ2MTEsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uLnByb2QiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwicm9sZXMiLCJlbWFpbCIsImFjY291bnRzLXJlYWQiLCJhY2NvdW50cy13cml0ZSIsIm9yZGVycy1yZWFkIiwib3JkZXJzLXdyaXRlIiwiY29tcGFuaWVzLXJlYWQiLCJpbmRpdmlkdWFscy1yZWFkIiwiZmluYW5jZS1yZWFkIiwicG9zdHMtd3JpdGUiLCJwb3N0cy1yZWFkIiwic3ltYm9scy1yZWFkIiwidXNlci1kYXRhLXJlYWQiLCJ1c2VyLWRhdGEtd3JpdGUiLCJ1c2Vycy1yZWFkIiwic2VhcmNoIiwiYWNhZGVteS1yZWFkIiwiYWNhZGVteS13cml0ZSIsImJsb2ctcmVhZCIsImludmVzdG9wZWRpYS1yZWFkIl0sInN1YiI6IjFmYjk2MjdjLWVkNmMtNDA0ZS1iMTY1LTFmODNlOTAzYzUyZCIsImF1dGhfdGltZSI6MTY5ODU2NDYxMSwiaWRwIjoiRmFjZWJvb2siLCJuYW1lIjoibWluaHBuLm9yZy5lYzFAZ21haWwuY29tIiwic2VjdXJpdHlfc3RhbXAiOiI4MjMzNzA4ZS1iMWM5LTRmZDctOTBiZi0zMjY1NjNiZTg3YmQiLCJqdGkiOiJhMWFhMmZmYzc3NTA0MGNlMzRiZTYzODhiM2Y5MzA2NSIsImFtciI6WyJleHRlcm5hbCJdfQ.jtEJIfcGwBdEzQc62PAv_d3O5FC-8LnA2o3PJ1QjsgYMwQCUd4l7DcFCfixwrH9zbmlkB6TYvn7DhxbDcUqbXMRh9GJeFflMVjGRtKi4pfJCZ1ISrsHoLcrkeeLBmznCxyXT8-vjd02YPPmxRToiCOC0Bgc_pIn6BAR35S5MOKlFt9NAuuEXs4irUxBvNu0aA-6GYrFRk-a65RnsBTdA2N0m9ApfgaWOZLo6xGw4r_8PNWvVKDqDLtilfkLImsVCMHF0AYjUE8AG3sbSUhK2lF5z_pwh9TiPp9KhHUar3Z8xL0lt50GtDdqtjiYT-hDPxS0mEzMr5jLcjQiaDtwHzw";

export default function Home() {
  const [data, setData] = useState(null);
  const request = useRequestStore((s) => s.request);

  useEffect(() => {
    const init = async () => {
      const res = await axios({
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        url: request!.url,
      });
      setData(res.data);
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
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Wichart />
        <hr />
        <Fireant />
      </Box>
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Box sx={{ height: "500px", overflow: "auto" }}>
          <Response data={data} />
        </Box>
        <hr />
        <Box>
          <TestResult />
        </Box>
      </Box>
    </Box>
  );
}
