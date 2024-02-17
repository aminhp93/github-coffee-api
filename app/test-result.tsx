"use client";

import { useRequestStore } from "./store";
import axios from "axios";
import { Button } from "@mui/material";
import { LIST_FIREANT_API, LIST_WICHART_API } from "./constants";

const token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxOTk4NTY0NjExLCJuYmYiOjE2OTg1NjQ2MTEsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uLnByb2QiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwicm9sZXMiLCJlbWFpbCIsImFjY291bnRzLXJlYWQiLCJhY2NvdW50cy13cml0ZSIsIm9yZGVycy1yZWFkIiwib3JkZXJzLXdyaXRlIiwiY29tcGFuaWVzLXJlYWQiLCJpbmRpdmlkdWFscy1yZWFkIiwiZmluYW5jZS1yZWFkIiwicG9zdHMtd3JpdGUiLCJwb3N0cy1yZWFkIiwic3ltYm9scy1yZWFkIiwidXNlci1kYXRhLXJlYWQiLCJ1c2VyLWRhdGEtd3JpdGUiLCJ1c2Vycy1yZWFkIiwic2VhcmNoIiwiYWNhZGVteS1yZWFkIiwiYWNhZGVteS13cml0ZSIsImJsb2ctcmVhZCIsImludmVzdG9wZWRpYS1yZWFkIl0sInN1YiI6IjFmYjk2MjdjLWVkNmMtNDA0ZS1iMTY1LTFmODNlOTAzYzUyZCIsImF1dGhfdGltZSI6MTY5ODU2NDYxMSwiaWRwIjoiRmFjZWJvb2siLCJuYW1lIjoibWluaHBuLm9yZy5lYzFAZ21haWwuY29tIiwic2VjdXJpdHlfc3RhbXAiOiI4MjMzNzA4ZS1iMWM5LTRmZDctOTBiZi0zMjY1NjNiZTg3YmQiLCJqdGkiOiJhMWFhMmZmYzc3NTA0MGNlMzRiZTYzODhiM2Y5MzA2NSIsImFtciI6WyJleHRlcm5hbCJdfQ.jtEJIfcGwBdEzQc62PAv_d3O5FC-8LnA2o3PJ1QjsgYMwQCUd4l7DcFCfixwrH9zbmlkB6TYvn7DhxbDcUqbXMRh9GJeFflMVjGRtKi4pfJCZ1ISrsHoLcrkeeLBmznCxyXT8-vjd02YPPmxRToiCOC0Bgc_pIn6BAR35S5MOKlFt9NAuuEXs4irUxBvNu0aA-6GYrFRk-a65RnsBTdA2N0m9ApfgaWOZLo6xGw4r_8PNWvVKDqDLtilfkLImsVCMHF0AYjUE8AG3sbSUhK2lF5z_pwh9TiPp9KhHUar3Z8xL0lt50GtDdqtjiYT-hDPxS0mEzMr5jLcjQiaDtwHzw";

export default function Home() {
  const handleTest = () => {
    const listPromise: any = [];

    [...LIST_WICHART_API, ...LIST_FIREANT_API].forEach((item) => {
      listPromise.push({
        url: item.url,
        promise: axios({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          url: item.url,
        }),
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return <Button onClick={handleTest}>Test reqsult</Button>;
}
