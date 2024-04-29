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
} from "@mui/icons-material";
import { useEffect, useState } from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const options = {
  title: {
    text: "My chart",
  },
  series: [
    {
      data: [1, 2, 3],
    },
  ],
};

type Display = "raw-api" | "table" | "chart";

const DashboardPage = () => {
  const [display, setDisplay] = useState<Display>("raw-api");

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: Display
  ) => {
    setDisplay(newAlignment);
  };

  const control = {
    value: display,
    onChange: handleChange,
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

  return (
    <div>
      <h1>Dashboard</h1>
      <ToggleButtonGroup size="small" {...control} aria-label="Small sizes">
        {children}
      </ToggleButtonGroup>
      {display === "raw-api" && <div>Raw data</div>}
      {display === "table" && <div>Table</div>}
      {display === "chart" && (
        <HighchartsReact highcharts={Highcharts} options={options} />
      )}
    </div>
  );
};

export default DashboardPage;
