"use client";

// Import libraries
import dynamic from "next/dynamic";
import { useEffect } from "react";
import axios from "axios";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

// Import local files
import { getRequest } from "./utils";
import { TOKEN, LIST_API } from "./constants";
import Request from "../@core/components/request";
import { useRequestStore } from "./store";

const Response = dynamic(() => import("@/@core/components/response"), {
  ssr: false,
});

const TestResult = dynamic(() => import("@/@core/components/test-result"), {
  ssr: false,
});

const Home = () => {
  const request = useRequestStore((s) => s.request);
  const response = useRequestStore((s) => s.response);
  const setResponse = useRequestStore((s) => s.setResponse);
  const allResponses = useRequestStore((s) => s.allResponses);

  useEffect(() => {
    if (!request) return;

    (async () => {
      try {
        const res = await axios(getRequest(TOKEN, request?.url)!);

        // find item by url
        const found = LIST_API.map((i) => i.request)
          .flat()
          .find((i) => i.url === request.url);

        console.log("found", found);
        if (found?.parseResponse) {
          found.parseResponse.parse(res.data);
        }

        const result = { ...res, url: request.url, status: "success" };
        setResponse(result);
      } catch (err: any) {
        const errorResult = { ...err, url: request.url, status: "failed" };
        setResponse(errorResult);
      }
    })();
  }, [request, setResponse]);

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
        {LIST_API.map((item) => (
          <Accordion key={item.id}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              {item.label}
            </AccordionSummary>
            <AccordionDetails>
              <Request
                requestList={item.request}
                response={response}
                allResponses={allResponses}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Box sx={{ height: "500px", overflow: "auto" }}>
          <Response
            requestObject={{
              token: TOKEN,
              url: request?.url,
            }}
            responseData={response}
          />
        </Box>
        <hr />
        <Box>
          <TestResult />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
