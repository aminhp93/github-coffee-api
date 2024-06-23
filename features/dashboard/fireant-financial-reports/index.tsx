// Import libaries
import { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";
import Highcharts from "highcharts";

// Import local files
import FireantService from "@/@core/services/fireant/Fireant.service";
import useFireantStore from "@/@core/services/fireant/useFireantStore";
import { RawData } from "../types";
import DashboardTable from "../components/DashboardTable";
import WatchlistConfig from "../components/WatchlistConfig";
import ConfigOption from "../components/TimeAndDisplayConfig";
import useConfigStore from "../useConfigStore";
import { getRows, getColumns, getOptions } from "./utils";

const FireantFinancialReports = () => {
  const config = useConfigStore((state) => state.config);
  const selectedWatchlist = useFireantStore((state) => state.selectedWatchlist);

  const [rawData, setRawData] = useState<RawData>([]);
  const [rows, setRows] = useState<any>([]);
  const [columns, setColumns] = useState<any>([]);
  const [options, setOptions] = useState<Highcharts.Options>();

  useEffect(() => {
    (async () => {
      try {
        const symbol = "VPB";
        const res = await FireantService.financialReports(symbol);
        setRawData(res);

        const rows = getRows(res);
        const columns = getColumns(res.columns);

        setRows(rows);
        setColumns(columns);
        setOptions((prev: any) => {
          const xxx = getOptions(res);
          return {
            ...prev,
            chart: {
              type: "column",
            },
            xAxis: xxx.xAxis,
            series: [xxx.series],
          };
        });
      } catch (err: any) {}
    })();
  }, [selectedWatchlist, config.category, config.timeRange]);

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
          <DashboardTable columns={columns} rows={rows} />
        )}
        {config.displayType === "chart" && (
          <HighchartsReact highcharts={Highcharts} options={options} />
        )}
      </Box>
    </Box>
  );
};

export default FireantFinancialReports;
