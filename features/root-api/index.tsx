/* eslint-disable @typescript-eslint/no-explicit-any */

// Import libraries
import { useState } from "react";
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

// Import local files: relative path
import Chart from "@/@core/components/chart";

// Import local files: absolute path
import AppTable from "./AppTable";
import { useRequestStore, useGetRequest } from "./store/request";
import ResponseComponent from "./response";
import TestResult from "./test-result";
import { LIST_API } from "./constants";
import RequestComponent from "./request";

type Display = "raw-api" | "table" | "chart";

const RootApi = () => {
  useGetRequest();
  const request = useRequestStore((s) => s.request);
  const response = useRequestStore((s) => s.response);
  const allResponses = useRequestStore((s) => s.allResponses);
  const [display, setDisplay] = useState<Display>("raw-api");

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
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
      <StyledBoxListApi>
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
              <RequestComponent
                companyId={item.id}
                requestList={item.request}
                response={response}
                allResponses={allResponses}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </StyledBoxListApi>
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Box sx={{ height: "500px", overflow: "auto" }}>
          <ToggleButtonGroup size="small" {...control} aria-label="Small sizes">
            {children}
          </ToggleButtonGroup>
          {display === "raw-api" && (
            <ResponseComponent request={request} response={response} />
          )}

          {display === "table" && <AppTable />}

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

const StyledBoxListApi = styled(Box)({
  flex: 1,
  minWidth: 0,
  overflow: "auto",
  height: "100%",
});

export default RootApi;
