"use client";

import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import {
  DataObject,
  TableRows,
  ShowChart,
  Newspaper,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { DATA } from "./constants";
import { PostsItem } from "@/@core/services/fireant/schema";
import FireantService from "@/@core/services/fireant/Fireant.service";

type Display = "raw-api" | "table" | "chart";
type Display2 = "fireant-news";

const mapData = (data: PostsItem[]) => {
  // group all data have same day like 2021-10-10
  const xxx = data.reduce((acc, item) => {
    const date = new Date(item.date).toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, PostsItem[]>);

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
      try {
        const listSymbols = ["HHV", "VPB"];

        const listPromises = listSymbols.map((symbol) => {
          return FireantService.posts(symbol).then((res) => {
            return {
              symbol,
              data: res,
            };
          });
        });

        const listRes = await Promise.all(listPromises);
        console.log(listRes);

        //  const mappedRes = listRes.map((item) => {
        //     return [item.symbol, item.data.length];
        //   })

        setData(listRes);

        setOptions((prev) => {
          return {
            ...prev,
            yAxis: {
              ...prev.yAxis,
              min: 0,
              // max value of second element in array mappedRes
              // max: Math.max(...mappedRes.map((i) => i[1])),
            },
            series: listRes.map((item) => {
              return {
                type: "line",
                name: item.symbol,
                data: mapData(item.data),
              };
            }),
          };
        });
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
      <Box></Box>
      {display === "raw-api" && <div>Raw data</div>}
      {display === "table" && <div>Table</div>}
      {display === "chart" && (
        <HighchartsReact highcharts={Highcharts} options={options} />
      )}
    </div>
  );
};

export default Dashboard;
