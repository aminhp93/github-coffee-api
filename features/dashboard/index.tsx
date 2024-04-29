"use client";

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
  Newspaper,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { DATA } from "./constants";

type Display = "raw-api" | "table" | "chart";
type Display2 = "fireant-news";

const Dashboard = () => {
  const [display, setDisplay] = useState<Display>("raw-api");
  const [display2, setDisplay2] = useState<Display2>("fireant-news");

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: Display
  ) => {
    setDisplay(newAlignment);
  };

  const handleChange2 = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: Display2
  ) => {
    setDisplay2(newAlignment);
  };

  const control = {
    value: display,
    onChange: handleChange,
    exclusive: true,
  };

  const control2 = {
    value: display2,
    onChange: handleChange2,
    exclusive: true,
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

  const children2 = [
    <ToggleButton value="fireant-news" key="fireant-news">
      <Newspaper />
    </ToggleButton>,
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <ToggleButtonGroup size="small" {...control} aria-label="Small sizes">
          {children}
        </ToggleButtonGroup>

        <ToggleButtonGroup size="small" {...control2} aria-label="Small sizes">
          {children2}
        </ToggleButtonGroup>
      </Box>
      {display === "raw-api" && <div>Raw data</div>}
      {display === "table" && <div>Table</div>}
      {display === "chart" && (
        <HighchartsReact
          highcharts={Highcharts}
          options={{
            // chart: {
            //   zoomType: "x",
            // },
            title: {
              text: "USD to EUR exchange rate over time",
              align: "left",
            },
            xAxis: {
              type: "datetime",
            },
            yAxis: {
              title: {
                text: "Exchange rate",
              },
            },
            legend: {
              enabled: false,
            },
            series: [
              {
                type: "area",
                name: "USD to EUR",
                data: DATA,
              },
            ],
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
