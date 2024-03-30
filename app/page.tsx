"use client";

// Import libraries
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ToggleButton,
  ToggleButtonGroup,
  styled,
} from "@mui/material";
import {
  ExpandMore,
  DataObject,
  TableRows,
  ShowChart,
} from "@mui/icons-material";

// Import local files
import { getRequest } from "./utils";
import { TOKEN, LIST_API } from "./constants";
import Request from "@/@core/components/request";
import Chart from "@/@core/components/chart";
import Table from "@/@core/components/table";
import { useRequestStore } from "./store";

const Response = dynamic(() => import("@/@core/components/response"), {
  ssr: false,
});

const TestResult = dynamic(() => import("@/@core/components/test-result"), {
  ssr: false,
});

type Display = "raw-api" | "table" | "chart";

const Home = () => {
  const request = useRequestStore((s) => s.request);
  const response = useRequestStore((s) => s.response);
  const setResponse = useRequestStore((s) => s.setResponse);
  const allResponses = useRequestStore((s) => s.allResponses);
  const [display, setDisplay] = useState<Display>("raw-api");

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

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: Display
  ) => {
    setDisplay(newAlignment);
  };

  const children = [
    <ToggleButton value="raw-api" key="raw-api">
      <DataObject />
    </ToggleButton>,
    <ToggleButton value="table" key="table">
      <TableRows />
    </ToggleButton>,
    <ToggleButton value="chart" key="chart">
      <ShowChart />
    </ToggleButton>,
  ];

  const control = {
    value: display,
    onChange: handleChange,
    exclusive: true,
  };

  return (
    <StyledBoxRoot>
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
          <ToggleButtonGroup size="small" {...control} aria-label="Small sizes">
            {children}
          </ToggleButtonGroup>
          {display === "raw-api" && (
            <Response
              requestObject={{
                token: TOKEN,
                url: request?.url,
              }}
              responseData={response}
            />
          )}

          {display === "table" && <Table />}

          {display === "chart" && <Chart />}
        </Box>
        <hr />
        <Box>
          <TestResult />
        </Box>
      </Box>
    </StyledBoxRoot>
  );
};

const StyledBoxRoot = styled(Box)({
  display: "flex",
  gap: "20px",
  padding: "20px",
  height: "100vh",
});

export default Home;
