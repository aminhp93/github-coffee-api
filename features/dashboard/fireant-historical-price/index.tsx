// Import libaries
import { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";
import Highcharts from "highcharts";

// Import local files
import { getDefaultOptions } from "@/@core/components/chart/utils";
import FireantService from "@/@core/services/fireant/Fireant.service";
import useFireantStore from "@/@core/services/fireant/useFireantStore";
import { RawData } from "../types";
import DashboardTable from "../components/DashboardTable";
import WatchlistConfig from "../components/WatchlistConfig";
import ConfigOption from "../components/TimeAndDisplayConfig";
import useConfigStore from "../useConfigStore";

const FireantHistoricalPrice = () => {
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
          <DashboardTable columns={[]} rows={rows} />
        )}
        {config.displayType === "chart" && (
          <HighchartsReact highcharts={Highcharts} options={options} />
        )}
      </Box>
    </Box>
  );
};

export default FireantHistoricalPrice;
