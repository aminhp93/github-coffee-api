"use client";

import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";

// import { DATA } from "./constants";
import FireantService from "@/@core/services/fireant/Fireant.service";
import DevToService from "@/@core/services/dev-to/DevTo.service";
import OneHousingService from "@/@core/services/one-housing/OneHousing.service";
import Header from "./Header";
import SubHeader from "./SubHeader";
import useConfigStore from "./useConfigStore";
import useFireantStore from "@/@core/services/fireant/useFireantStore";
import { RawData } from "./types";
import {
  getRows,
  mapData,
  mapDevToData,
  getDevToRows,
  getOneHousingRows,
} from "./utils";
import DashboardTable from "./DashboardTable";
import { CONFIG } from "./constants";

const Dashboard = () => {
  const config = useConfigStore((state) => state.config);
  const selectedWatchlist = useFireantStore((state) => state.selectedWatchlist);

  const [rawData, setRawData] = useState<RawData>([]);
  const [rows, setRows] = useState<any>([]);
  const [options, setOptions] = useState<Highcharts.Options>({
    title: {
      text: undefined,
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
      formatter: function () {
        // Sort the points
        const points: any = this.points;
        (points || []).sort(function (a: any, b: any) {
          return b && a && b.y! - a.y!;
        });

        // format x

        // Generate the tooltip text
        let tooltipText = "<b>" + this.x + "</b><br/>";
        (points || []).forEach(function (point: any) {
          tooltipText += point.series.name + ": " + point.y + "<br/>";
        });

        return tooltipText;
      },
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
      console.log(config.category);
      try {
        if (config.category === "fireant-news") {
          const listSymbols = selectedWatchlist?.symbols || [];

          const listPromises = listSymbols.map((symbol) => {
            return FireantService.news(symbol).then((res) => {
              return {
                symbol,
                data: res,
              };
            });
          });

          const listRes = await Promise.all(listPromises);

          setRawData(listRes);
          setRows(getRows(listRes));
          setOptions((prev) => {
            return {
              ...prev,
              yAxis: {
                ...prev.yAxis,
                min: 0,
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
        } else if (config.category === "fireant-post") {
          const listSymbols = selectedWatchlist?.symbols || [];

          const listPromises = listSymbols.map((symbol) => {
            return FireantService.posts(symbol).then((res) => {
              return {
                symbol,
                data: res,
              };
            });
          });

          const listRes = await Promise.all(listPromises);

          setRawData(listRes);
          setRows(getRows(listRes));
          setOptions((prev) => {
            return {
              ...prev,
              yAxis: {
                ...prev.yAxis,
                min: 0,
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
        } else if (config.category === "dev-to") {
          const numberOfPages = 10;

          const listPromises = Array.from({ length: numberOfPages }).map(
            (_, index) => {
              return DevToService.getStories(index + 1, "latest");
            }
          );

          const listRes = await Promise.all(listPromises);
          const flattenListRes = listRes.flat();

          setRawData(flattenListRes);

          setRows(getDevToRows(flattenListRes));

          setOptions((prev) => {
            return {
              ...prev,
              yAxis: {
                ...prev.yAxis,
                min: 0,
              },
              series: [
                {
                  type: "line",
                  name: "Dev.to",
                  data: mapDevToData(flattenListRes),
                },
              ],
            };
          });
        } else if (config.category === "one-housing") {
          const requestData = {
            search_type: "RECOMMENDATION",
            property_provider_source: ["SECONDARY"],
            available_for_sale: true,
          };

          const res = await OneHousingService.list(1, requestData);
          setRawData(res.data);
          setRows(getOneHousingRows(res.data));
        } else if (config.category === "fireant-financial-report") {
          const listSymbols = selectedWatchlist?.symbols || ["VPB"];

          const listPromises = listSymbols.map((symbol) => {
            return FireantService.financialReports(symbol).then((res) => {
              return {
                symbol,
                data: res,
              };
            });
          });

          const listRes = await Promise.all(listPromises);

          setRawData(listRes);
          // setRows(getRows(listRes));
          // setOptions((prev) => {
          //   return {
          //     ...prev,
          //     yAxis: {
          //       ...prev.yAxis,
          //       min: 0,
          //     },
          //     series: listRes.map((item) => {
          //       return {
          //         type: "line",
          //         name: item.symbol,
          //         data: mapData(item.data),
          //       };
          //     }),
          //   };
          // });
        } else if (config.category === "fireant-historical-price") {
          const listSymbols = selectedWatchlist?.symbols || ["VPB"];

          const listPromises = listSymbols.map((symbol) => {
            return FireantService.historicalPrice(symbol).then((res) => {
              return {
                symbol,
                data: res,
              };
            });
          });

          const listRes = await Promise.all(listPromises);

          setRawData(listRes);
          // setRows(getRows(listRes));
          // setOptions((prev) => {
          //   return {
          //     ...prev,
          //     yAxis: {
          //       ...prev.yAxis,
          //       min: 0,
          //     },
          //     series: listRes.map((item) => {
          //       return {
          //         type: "line",
          //         name: item.symbol,
          //         data: mapData(item.data),
          //       };
          //     }),
          //   };
          // });
        }
      } catch (err: any) {}
    })();
  }, [selectedWatchlist, config.category, config.timeRange]);

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
    <Box>
      <Header />
      <Box mt={2}>
        <SubHeader />
      </Box>
      <Box mt={2}>
        {config.displayType === "raw-data" && (
          <Box
            sx={{
              height: "300px",
              overflow: "auto",
            }}
          >
            <pre>{JSON.stringify(rawData, null, 2)}</pre>
          </Box>
        )}
        {config.displayType === "table" && (
          <DashboardTable
            initialStateConfig={CONFIG[config.category].initialStateConfig}
            columns={CONFIG[config.category].columns}
            rows={rows}
          />
        )}
        {config.displayType === "chart" && (
          <HighchartsReact highcharts={Highcharts} options={options} />
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
