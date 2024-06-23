// Import libaries
import { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";
import Highcharts from "highcharts";
import { GridColDef } from "@mui/x-data-grid-premium";

// Import local files
import { getDefaultOptions } from "@/@core/components/chart/utils";
import DevToService from "@/@core/services/dev-to/DevTo.service";
import useFireantStore from "@/@core/services/fireant/useFireantStore";
import { RawData } from "../types";
import { getRows } from "../utils";
import { mapOptions } from "./utils";
import DashboardTable from "../components/DashboardTable";
import WatchlistConfig from "../components/WatchlistConfig";
import ConfigOption from "../components/TimeAndDisplayConfig";
import useConfigStore from "../useConfigStore";

const DevTo = () => {
  const config = useConfigStore((state) => state.config);
  const selectedWatchlist = useFireantStore((state) => state.selectedWatchlist);

  const [rawData, setRawData] = useState<RawData>([]);
  const [rows, setRows] = useState<any>([]);
  const [options, setOptions] = useState<Highcharts.Options>(
    getDefaultOptions()
  );

  useEffect(() => {
    (async () => {
      try {
        const numberOfPages = 10;

        const listPromises = Array.from({ length: numberOfPages }).map(
          (_, index) => {
            return DevToService.getStories(index + 1, "latest");
          }
        );

        const listRes = await Promise.all(listPromises);
        const flattenListRes = listRes.flat();

        setRawData(flattenListRes);

        setRows(getRows(flattenListRes));

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
                data: mapOptions(flattenListRes),
              },
            ],
          };
        });
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
      <ConfigOption />
      <WatchlistConfig />

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
            initialStateConfig={{
              rowGrouping: {
                model: ["groupedDate"],
              },
            }}
            columns={columns}
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

export default DevTo;

const columns: GridColDef[] = [
  { field: "groupedDate", headerName: "Grouped Date", width: 150 },
  { field: "id", headerName: "id", width: 100, groupable: false },
  {
    field: "comments_count",
    headerName: "comments_count",
    width: 100,
    groupable: false,
  },
  {
    field: "public_reactions_count",
    headerName: "public_reactions_count",
    width: 100,
    groupable: false,
  },
  {
    field: "reading_time",
    headerName: "reading_time",
    width: 100,
    groupable: false,
  },
  {
    field: "title",
    headerName: "title",
    groupable: false,
    flex: 1,
    renderCell: (params) => {
      return (
        <a href={`https://dev.to/${params.row.path}`} target="_blank">
          {params.value}
        </a>
      );
    },
  },
];
