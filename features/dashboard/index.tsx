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
import { LIST_FIREANT_API, TOKEN } from "@/app/constants";
import { getRequest } from "@/app/utils";
import { keyBy } from "lodash";

import { DATA } from "./constants";
import { PostType } from "@/app/fireant/schema";
import axios from "axios";

const OBJ_FIREANT_API = keyBy(LIST_FIREANT_API, "name");

type Display = "raw-api" | "table" | "chart";
type Display2 = "fireant-news";

const mapData = (data: PostType[]) => {
  // group all data have same day like 2021-10-10
  const xxx = data.reduce((acc, item) => {
    const date = new Date(item.date).toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, PostType[]>);

  console.log(xxx);

  // return data.map((item) => {
  //   return [Date.parse(item.date), item.postID];
  // });

  return Object.keys(xxx).map((key) => {
    return [Date.parse(key), xxx[key].length];
  });
};

const Dashboard = () => {
  const [display, setDisplay] = useState<Display>("raw-api");

  const [display2, setDisplay2] = useState<Display2>("fireant-news");

  const [data, setData] = useState<any>(DATA);
  const [options, setOptions] = useState<Highcharts.Options>({
    // chart: {
    //   zoomType: "x",
    // },
    title: {
      text: "USD to EUR exchange rate over time",
      align: "left",
    },
    xAxis: [
      {
        type: "datetime",
        tickInterval: 24 * 3600 * 1000,
        // min: 0,
        // get current tme and subtract 1 week
        min: new Date().getTime() - 604800000,

        // get current time and add 1 day
        max: new Date().getTime() + 86400000,
      },
    ],
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
        data: [],
      },
    ],
  });

  useEffect(() => {
    (async () => {
      console.log(OBJ_FIREANT_API);
      try {
        const res = await axios(
          getRequest(TOKEN, OBJ_FIREANT_API["Posts"].url)!
        );
        console.log(res);
        const mappedRes = mapData(res.data);
        setData(mappedRes);

        setOptions((prev) => {
          return {
            ...prev,
            yAxis: {
              ...prev.yAxis,
              // min value of second element in array mappedRes
              // min: Math.min(...mappedRes.map((i) => i[1])),
              min: 0,
              // max value of second element in array mappedRes
              max: Math.max(...mappedRes.map((i) => i[1])),
            },
            series: [
              {
                type: "line",
                name: "",
                data: mappedRes,
              },
            ],
          };
        });

        // find item by url
      } catch (err: any) {}
    })();
  }, []);

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
        <HighchartsReact highcharts={Highcharts} options={options} />
      )}
    </div>
  );
};

export default Dashboard;
