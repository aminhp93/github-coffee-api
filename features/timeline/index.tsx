"use client";

import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const options = {
  title: {
    text: "U.S Solar Employment Growth",
    align: "left",
  },

  tooltip: {
    shared: true,
  },

  yAxis: {
    title: {
      text: "Number of Employees",
    },
  },

  xAxis: [
    {
      type: "datetime",
      gridLineWidth: 1,
      // tickInterval every 1 month
      tickInterval: 30 * 24 * 3600 * 1000,
      // min as start of current year
      min: new Date(2024, 0, 1).getTime(),
      // end the current year
      max: new Date(2024, 11, 31).getTime(),
    },
  ],

  legend: {
    layout: "vertical",
    align: "right",
    verticalAlign: "middle",
  },

  series: [
    {
      name: "Timeline",
      // new Date as start of Dec 2024
      data: [
        {
          x: new Date(2024, 11, 1).getTime(),
          y: 100,
          name: "Mua nha",
        },
      ],
    },
  ],
};

const TimelineChart = () => (
  <HighchartsReact highcharts={Highcharts} options={options} />
);

export default TimelineChart;
