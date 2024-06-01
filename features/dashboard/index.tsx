"use client";

import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// import { DATA } from "./constants";
import { PostsItem } from "@/@core/services/fireant/schema";
import FireantService from "@/@core/services/fireant/Fireant.service";
import Header from "./Header";
import SubHeader from "./SubHeader";
import useConfigStore from "./useConfigStore";
import useFireantStore from "@/@core/services/fireant/useFireantStore";

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
  const config = useConfigStore((state) => state.config);
  // const [data, setData] = useState<any>(DATA);
  const selectedWatchlist = useFireantStore((state) => state.selectedWatchlist);

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
        gridLineWidth: 1,
        tickInterval: 24 * 3600 * 1000,
        // get current tme and subtract 1 week
        min: new Date().getTime() - 604800000,

        // get current time and add 1 day
        max: new Date().getTime() + 86400000,
      },
    ],
    tooltip: {
      shared: true,
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
        data: [],
      },
    ],
  });

  useEffect(() => {
    (async () => {
      try {
        // const listSymbols = ["HHV", "VPB"];
        const listSymbols = selectedWatchlist?.symbols || [];
        console.log(selectedWatchlist, listSymbols);

        const listPromises = listSymbols.map((symbol) => {
          return FireantService.posts(symbol).then((res) => {
            return {
              symbol,
              data: res,
            };
          });
        });

        const listRes = await Promise.all(listPromises);

        //  const mappedRes = listRes.map((item) => {
        //     return [item.symbol, item.data.length];
        //   })

        // setData(listRes);

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
  }, [selectedWatchlist]);

  console.log({ selectedWatchlist });

  useEffect(() => {
    setOptions((prev) => {
      // convert config.timeRange to miliseconds like '1m' => 30 * 24 * 3600 * 1000
      let subTractTimestamp = 0;
      if (config.timeRange === "1m") {
        subTractTimestamp = 30 * 24 * 3600 * 1000;
      } else if (config.timeRange === "1w") {
        subTractTimestamp = 7 * 24 * 3600 * 1000;
      } else if (config.timeRange === "1d") {
        subTractTimestamp = 24 * 3600 * 1000;
      }

      return {
        ...prev,
        xAxis: [
          {
            type: "datetime",
            gridLineWidth: 1,
            tickInterval: 24 * 3600 * 1000,
            min: new Date().getTime() - subTractTimestamp,
            // get current time and add 1 day
            max: new Date().getTime() + 86400000,
          },
        ],
      };
    });
  }, [config.timeRange]);

  return (
    <div>
      <Header />
      <SubHeader />

      {config.displayType === "raw-data" && <div>Raw data</div>}
      {config.displayType === "table" && <div>Table</div>}
      {config.displayType === "chart" && (
        <HighchartsReact highcharts={Highcharts} options={options} />
      )}
    </div>
  );
};

export default Dashboard;
