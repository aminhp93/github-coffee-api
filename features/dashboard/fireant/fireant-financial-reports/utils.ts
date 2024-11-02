/* eslint-disable @typescript-eslint/no-explicit-any */

import { GridColDef } from "@mui/x-data-grid-premium";
import { NUMBER } from "@/@core/constants/unit";

export const getRows = (data: any) => {
  const result: any = [];
  const rows = data?.rows;
  const columns = data?.columns;
  if (!rows || !columns) return result;
  rows.forEach((row: any) => {
    const obj: any = {};
    columns.forEach((column: any, index: number) => {
      obj[column] = row[index];
      // add id
      obj.id = row[0];
    });
    result.push(obj);
  });
  return result;
};

export const getColumns = (columns: any): GridColDef[] => {
  if (!columns) return [];
  const result = columns.map((column: any) => {
    return {
      field: column,
      headerName: column,
      width: 200,
      renderCell: (params: any) => {
        const value = params.value;
        // if value type if number, format it
        if (typeof value === "number") {
          return formatNumberColumn(value);
        }
        return value;
      },
    };
  });
  return result;
};

const formatNumberColumn = (value: number) => {
  // divide by 1 billion
  const divived_value = value / NUMBER.BILLION;
  // divived_value is like 12345,67. Format it like 12,345
  return divived_value.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
};

export const getOptions = (data: any) => {
  const rows = getRows(data);
  const row0 = rows[0];

  const xAxisCategories = Object.keys(row0).filter(
    (key) => key !== "Name" && key !== "id" && key !== "Symbol"
  );

  const xAxis = {
    categories: xAxisCategories,
  };

  const series = {
    name: row0["Name"],
    data: xAxisCategories.map((i) => row0[i]),
  };

  return {
    xAxis,
    series,
  };
};
