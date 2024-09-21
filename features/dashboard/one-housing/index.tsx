/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Import libaries
import { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";
import Highcharts from "highcharts";
import { GridColDef } from "@mui/x-data-grid-premium";

// Import local files
import { getDefaultOptions } from "@/@core/components/chart/utils";
import OneHousingService from "@/@core/services/one-housing/OneHousing.service";
import useFireantStore from "@/@core/services/fireant/useFireantStore";
import { RawData } from "../types";
import { getRows } from "./utils";
import DashboardTable from "../@components/DashboardTable";
import WatchlistConfig from "../@components/WatchlistConfig";
import ConfigOption from "../@components/TimeAndDisplayConfig";
import useConfigStore from "../useConfigStore";

const OneHousing = () => {
  const config = useConfigStore((state) => state.config);
  const selectedWatchlist = useFireantStore((state) => state.selectedWatchlist);

  const [rawData, setRawData] = useState<RawData>([]);
  const [rows, setRows] = useState<any>([]);
  const [options, setOptions] =
    useState<Highcharts.Options>(getDefaultOptions());

  useEffect(() => {
    (async () => {
      try {
        const requestData = {
          search_type: "RECOMMENDATION",
          property_provider_source: ["SECONDARY"],
          available_for_sale: true,
        };

        const res = await OneHousingService.list(1, requestData);
        setRawData(res.data);
        setRows(getRows(res.data));
      } catch (error: any) {
        // eslint-disable-next-line no-console
      }
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
          <DashboardTable columns={columns} rows={rows} />
        )}
        {config.displayType === "chart" && (
          <HighchartsReact highcharts={Highcharts} options={options} />
        )}
      </Box>
    </Box>
  );
};

export default OneHousing;

const columns: GridColDef[] = [
  { field: "urgent_sale", headerName: "urgent_sale", width: 100 },
  { field: "province", headerName: "province", width: 100 },
  { field: "legal_total_area", headerName: "legal_total_area", width: 100 },
  { field: "max_area", headerName: "max_area", width: 100 },
  { field: "min_area", headerName: "min_area", width: 100 },
  { field: "max_selling_price", headerName: "max_selling_price", width: 100 },
  { field: "min_selling_price", headerName: "min_selling_price", width: 100 },
  { field: "min_unit_price", headerName: "min_unit_price", width: 100 },
  { field: "number_of_bedrooms", headerName: "number_of_bedrooms", width: 100 },
  { field: "floor_number", headerName: "floor_number", width: 100 },
  {
    field: "view_count",
    headerName: "view_count",
    width: 100,
    renderCell: (params) => {
      return <div>{params.row.view_count.count}</div>;
    },
  },
  { field: "district", headerName: "district", width: 100 },
  { field: "district_code", headerName: "district_code", width: 100 },
  { field: "project_name", headerName: "project_name", width: 100 },
];
