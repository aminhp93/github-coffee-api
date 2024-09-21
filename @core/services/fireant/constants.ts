export const TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxOTk4NTY0NjExLCJuYmYiOjE2OTg1NjQ2MTEsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uLnByb2QiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwicm9sZXMiLCJlbWFpbCIsImFjY291bnRzLXJlYWQiLCJhY2NvdW50cy13cml0ZSIsIm9yZGVycy1yZWFkIiwib3JkZXJzLXdyaXRlIiwiY29tcGFuaWVzLXJlYWQiLCJpbmRpdmlkdWFscy1yZWFkIiwiZmluYW5jZS1yZWFkIiwicG9zdHMtd3JpdGUiLCJwb3N0cy1yZWFkIiwic3ltYm9scy1yZWFkIiwidXNlci1kYXRhLXJlYWQiLCJ1c2VyLWRhdGEtd3JpdGUiLCJ1c2Vycy1yZWFkIiwic2VhcmNoIiwiYWNhZGVteS1yZWFkIiwiYWNhZGVteS13cml0ZSIsImJsb2ctcmVhZCIsImludmVzdG9wZWRpYS1yZWFkIl0sInN1YiI6IjFmYjk2MjdjLWVkNmMtNDA0ZS1iMTY1LTFmODNlOTAzYzUyZCIsImF1dGhfdGltZSI6MTY5ODU2NDYxMSwiaWRwIjoiRmFjZWJvb2siLCJuYW1lIjoibWluaHBuLm9yZy5lYzFAZ21haWwuY29tIiwic2VjdXJpdHlfc3RhbXAiOiI4MjMzNzA4ZS1iMWM5LTRmZDctOTBiZi0zMjY1NjNiZTg3YmQiLCJqdGkiOiJhMWFhMmZmYzc3NTA0MGNlMzRiZTYzODhiM2Y5MzA2NSIsImFtciI6WyJleHRlcm5hbCJdfQ.jtEJIfcGwBdEzQc62PAv_d3O5FC-8LnA2o3PJ1QjsgYMwQCUd4l7DcFCfixwrH9zbmlkB6TYvn7DhxbDcUqbXMRh9GJeFflMVjGRtKi4pfJCZ1ISrsHoLcrkeeLBmznCxyXT8-vjd02YPPmxRToiCOC0Bgc_pIn6BAR35S5MOKlFt9NAuuEXs4irUxBvNu0aA-6GYrFRk-a65RnsBTdA2N0m9ApfgaWOZLo6xGw4r_8PNWvVKDqDLtilfkLImsVCMHF0AYjUE8AG3sbSUhK2lF5z_pwh9TiPp9KhHUar3Z8xL0lt50GtDdqtjiYT-hDPxS0mEzMr5jLcjQiaDtwHzw";

export const DEFAULT_OFFSET = 0;
export const DEFAULT_LIMIT = 50;

export type FinancialReportsType = "IS" | "BS" | "CF";
export type Period = "Q" | "Y";

export const FireantUrls: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: (...args: any[]) => string;
} = {
  // https://restv2.fireant.vn/symbols/VPB/fundamental
  fundamental: (symbol: string = "VPB") => `/symbols/${symbol}/fundamental`,
  // https://restv2.fireant.vn/posts?symbol=VPB&type=1&offset=0&limit=20
  news: (symbol: string = "VPB", offset: number = 0, limit: number = 5) =>
    `/posts?symbol=${symbol}&type=1&offset=${offset}&limit=${limit}`,
  // https://restv2.fireant.vn/posts?symbol=VPB&type=0&offset=0&limit=5
  posts: (symbol: string = "VPB", offset: number = 0, limit: number = 5) =>
    `/posts?symbol=${symbol}&type=0&offset=${offset}&limit=${limit}`,
  // https://restv2.fireant.vn/me/watchlists
  watchlists: () => "/me/watchlists",
  // https://restv2.fireant.vn/symbols/VPB/profile
  profile: (symbol: string = "VPB") => `/symbols/${symbol}/profile`,
  // https://restv2.fireant.vn/symbols/VPB/rrg?startDate=2023-02-14&endDate=2024-02-14
  rrg: (
    symbol: string = "VPB",
    startDate: string = "2023-02-14",
    endDate: string = "2024-02-14"
  ) => `/symbols/${symbol}/rrg?startDate=${startDate}&endDate=${endDate}`,
  // https://restv2.fireant.vn/symbols/VPB/timescale-marks?startDate=2022-11-29&endDate=2037-01-01
  timescaleMarks: (
    symbol: string = "VPB",
    startDate: string = "2022-11-29",
    endDate: string = "2037-01-01"
  ) =>
    `/symbols/${symbol}/timescale-marks?startDate=${startDate}&endDate=${endDate}`,
  // https://restv2.fireant.vn/symbols/VPB/officers
  officers: (symbol: string = "VPB") => `/symbols/${symbol}/officers`,
  // https://restv2.fireant.vn/symbols/VPB/subsidiaries
  subsidiaries: (symbol: string = "VPB") => `/symbols/${symbol}/subsidiaries`,
  // https://restv2.fireant.vn/symbols/VPB/holders
  holders: (symbol: string = "VPB") => `/symbols/${symbol}/holders`,
  // https://restv2.fireant.vn/symbols/VPB/dividends?count=4
  dividends: (symbol: string = "VPB", count: number = 4) =>
    `/symbols/${symbol}/dividends?count=${count}`,
  // https://restv2.fireant.vn/events/search?symbol=VPB&orderBy=1&type=0&startDate=2014-02-14&endDate=2034-02-14&offset=0&limit=20
  events: (
    symbol: string = "VPB",
    orderBy: number = 1,
    type: number = 0,
    startDate: string = "2014-02-14",
    endDate: string = "2034-02-14",
    offset: number = 0,
    limit: number = 20
  ) =>
    `/events/search?symbol=${symbol}&orderBy=${orderBy}&type=${type}&startDate=${startDate}&endDate=${endDate}&offset=${offset}&limit=${limit}`,
  // https://restv2.fireant.vn/symbols/VPB/financial-reports?type=IS&period=Q&compact=true&offset=0&limit=5
  financialReports: (
    symbol: string = "VPB",
    type: FinancialReportsType = "IS",
    period: Period = "Q",
    compact: boolean = true,
    offset: number = 0,
    limit: number = 5
  ) =>
    `/symbols/${symbol}/financial-reports?type=${type}&period=${period}&compact=${compact}&offset=${offset}&limit=${limit}`,
  // https://restv2.fireant.vn/symbols/VPB/financial-indicators
  financialIndicators: (symbol: string = "VPB") =>
    `/symbols/${symbol}/financial-indicators`,
  // https://restv2.fireant.vn/symbols/VPB/historical-quotes?startDate=2021-06-23&endDate=2024-06-23&offset=0&limit=20
  historicalPrice: (
    symbol: string = "VPB",
    startDate: string = "2021-06-23",
    endDate: string = "2024-06-23",
    offset: number = 0,
    limit: number = 20
  ) =>
    `/symbols/${symbol}/historical-quotes?startDate=${startDate}&endDate=${endDate}&offset=${offset}&limit=${limit}`,
};
