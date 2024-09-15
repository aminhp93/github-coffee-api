/* eslint-disable @typescript-eslint/no-explicit-any */

// Import libaries
import { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";
import Highcharts from "highcharts";

// Import local files
import FireantService from "@/@core/services/fireant/service";
import useFireantStore from "@/@core/services/fireant/useFireantStore";
import { RawData } from "../types";
import DashboardTable from "../components/DashboardTable";
import SymbolConfig from "../components/SymbolConfig";
import ConfigOption from "../components/TimeAndDisplayConfig";
import useConfigStore from "../useConfigStore";
import { getRows, getColumns, getOptions } from "./utils";

const FireantFinancialReports = () => {
  const config = useConfigStore((state) => state.config);
  const selectedSymbol = useFireantStore((state) => state.selectedSymbol);

  const [rawData, setRawData] = useState<RawData>([]);
  const [rows, setRows] = useState<any>([]);
  const [columns, setColumns] = useState<any>([]);
  const [options, setOptions] = useState<Highcharts.Options>();

  useEffect(() => {
    (async () => {
      try {
        if (!selectedSymbol) return;
        const res = await FireantService.financialReports(selectedSymbol);
        const xxx = getOptions(res);
        const rows = getRows(res);
        const columns = getColumns(res.columns);

        setRawData(res);
        setRows(rows);
        setColumns(columns);
        setOptions((prev: any) => {
          return {
            ...prev,
            chart: {
              type: "column",
            },
            xAxis: xxx.xAxis,
            series: [xxx.series],
          };
        });
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    })();
  }, [selectedSymbol]);

  return (
    <Box>
      <ConfigOption />
      <SymbolConfig />

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
