import { Request } from "@/features/root-api/request/types";
import { FireantUrls } from "@/@core/services/fireant/constants";
import { FundamentalSchema } from "@/@core/services/fireant/schema";
import { baseURL } from "@/@core/services/fireant/service";

export const LIST_WICHART_API: Request[] = [
  {
    url: "https://wifeed.vn/api/thong-tin-co-phieu/danh-sach-ma-chung-khoan?loaidn=1&san=HOSE",
    name: "Danh sách mã chứng khoán",
    id: "1",
  },
  {
    url: "https://wifeed.vn/api/thong-bao-api/cap-nhat-du-lieu?page=1&limit=100",
    name: "Thông báo cập nhật dữ liệu",
    id: "2",
  },
];

export const LIST_FIREANT_API: Request[] = Object.keys(FireantUrls).map(
  (key) => {
    let schema;
    if (key === "fundamental") {
      schema = FundamentalSchema;
    }

    return {
      url: baseURL + FireantUrls[key](),
      name: key,
      id: key,
      schema,
    };
  }
);

export const LIST_API = [
  {
    id: "wichart",
    label: "Wichart",
    request: LIST_WICHART_API,
  },
  {
    id: "fireant",
    label: "Fireant",
    request: LIST_FIREANT_API,
  },
];
