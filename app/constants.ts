export const TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxOTk4NTY0NjExLCJuYmYiOjE2OTg1NjQ2MTEsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uLnByb2QiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwicm9sZXMiLCJlbWFpbCIsImFjY291bnRzLXJlYWQiLCJhY2NvdW50cy13cml0ZSIsIm9yZGVycy1yZWFkIiwib3JkZXJzLXdyaXRlIiwiY29tcGFuaWVzLXJlYWQiLCJpbmRpdmlkdWFscy1yZWFkIiwiZmluYW5jZS1yZWFkIiwicG9zdHMtd3JpdGUiLCJwb3N0cy1yZWFkIiwic3ltYm9scy1yZWFkIiwidXNlci1kYXRhLXJlYWQiLCJ1c2VyLWRhdGEtd3JpdGUiLCJ1c2Vycy1yZWFkIiwic2VhcmNoIiwiYWNhZGVteS1yZWFkIiwiYWNhZGVteS13cml0ZSIsImJsb2ctcmVhZCIsImludmVzdG9wZWRpYS1yZWFkIl0sInN1YiI6IjFmYjk2MjdjLWVkNmMtNDA0ZS1iMTY1LTFmODNlOTAzYzUyZCIsImF1dGhfdGltZSI6MTY5ODU2NDYxMSwiaWRwIjoiRmFjZWJvb2siLCJuYW1lIjoibWluaHBuLm9yZy5lYzFAZ21haWwuY29tIiwic2VjdXJpdHlfc3RhbXAiOiI4MjMzNzA4ZS1iMWM5LTRmZDctOTBiZi0zMjY1NjNiZTg3YmQiLCJqdGkiOiJhMWFhMmZmYzc3NTA0MGNlMzRiZTYzODhiM2Y5MzA2NSIsImFtciI6WyJleHRlcm5hbCJdfQ.jtEJIfcGwBdEzQc62PAv_d3O5FC-8LnA2o3PJ1QjsgYMwQCUd4l7DcFCfixwrH9zbmlkB6TYvn7DhxbDcUqbXMRh9GJeFflMVjGRtKi4pfJCZ1ISrsHoLcrkeeLBmznCxyXT8-vjd02YPPmxRToiCOC0Bgc_pIn6BAR35S5MOKlFt9NAuuEXs4irUxBvNu0aA-6GYrFRk-a65RnsBTdA2N0m9ApfgaWOZLo6xGw4r_8PNWvVKDqDLtilfkLImsVCMHF0AYjUE8AG3sbSUhK2lF5z_pwh9TiPp9KhHUar3Z8xL0lt50GtDdqtjiYT-hDPxS0mEzMr5jLcjQiaDtwHzw";

export const LIST_WICHART_API = [
  {
    url: "https://wifeed1.vn/api/thong-tin-co-phieu/danh-sach-ma-chung-khoan?loaidn=1&san=HOSE",
    name: "Danh sách mã chứng khoán",
    id: 1,
  },
  {
    url: "https://wifeed.vn/api/thong-bao-api/cap-nhat-du-lieu?page=1&limit=100",
    name: "Thông báo cập nhật dữ liệu",
    id: 2,
  },
];

export const LIST_FIREANT_API = [
  {
    url: "https://restv2.fireant.vn/symbols/VPB/fundamental",
    name: "Fundamental",
    id: 1,
  },
  {
    url: "https://restv2.fireant.vn/me/watchlists",
    name: "Watchlists",
    id: 2,
  },
  {
    url: "https://restv2.fireant.vn/symbols/VPB/profile",
    name: "Profile",
    id: 3,
  },
  {
    url: "https://restv2.fireant.vn/symbols/VPB/rrg?startDate=2023-02-14&endDate=2024-02-14",
    name: "RRG",
    id: 4,
  },
  {
    url: "https://restv2.fireant.vn/posts?symbol=VPB&type=1&offset=0&limit=20",
    name: "Posts",
    id: 5,
  },
  {
    url: "https://restv2.fireant.vn/symbols/VPB/timescale-marks?startDate=2022-11-29&endDate=2037-01-01",
    name: "Timescale Marks",
    id: 6,
  },
  {
    url: "https://restv2.fireant.vn/symbols/VPB/officers",
    name: "Officers",
    id: 7,
  },
  {
    url: "https://restv2.fireant.vn/symbols/VPB/subsidiaries",
    name: "Subsidiaries",
    id: 8,
  },
  {
    url: "https://restv2.fireant.vn/symbols/VPB/holders",
    name: "Holders",
    id: 9,
  },
  {
    url: "https://restv2.fireant.vn/symbols/VPB/dividends?count=4",
    name: "Dividends",
    id: 10,
  },
  {
    url: "https://restv2.fireant.vn/events/search?symbol=VPB&orderBy=1&type=0&startDate=2014-02-14&endDate=2034-02-14&offset=0&limit=20",
    name: "Events",
    id: 11,
  },
  {
    url: "https://restv2.fireant.vn/symbols/VPB/financial-reports?type=BS&period=Q&compact=true&offset=0&limit=5",
    name: "Financial Reports",
    id: 12,
  },
  {
    url: "https://restv2.fireant.vn/symbols/VPB/financial-indicators",
    name: "Financial Indicators",
    id: 13,
  },
  {
    url: "https://restv2.fireant.vn/symbols/VPB/historical-quotes?startDate=2021-02-14&endDate=2024-02-14&offset=0&limit=20",
    name: "Historical Quotes",
    id: 14,
  },
];
