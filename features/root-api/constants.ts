import { Request } from "@/features/root-api/request/types";
import { FireantUrls } from "@/@core/services/fireant/constants";
import { DevToUrls } from "@/@core/services/dev-to/constants";
import { FMarketUrls } from "@/@core/services/f-market/constants";
import {
  FundamentalSchema,
  PostSchema,
  WatchlistsSchema,
  ProfileSchema,
  RrgSchema,
  FinancialReportSchema,
  HistoricalPriceSchema,
  TimescaleMarksSchema,
  OfficersSchema,
  SubsidiariesSchema,
  HoldersSchema,
  DividendsSchema,
  EventsSchema,
  FinancialIndicatorsSchema,
} from "@/@core/services/fireant/schema";
import {
  SearchResponseSchema,
  StoriesResponseSchema,
} from "@/@core/services/dev-to/schema";
import {
  NavHistoryResponseSchema,
  FilterProductsResponseSchema,
} from "@/@core/services/f-market/schema";
import FireantService, {
  baseURL as FireantBaseURL,
} from "@/@core/services/fireant/service";
import DevToService, {
  baseURL as DevToBaseURL,
} from "@/@core/services/dev-to/service";
import FMarketService, {
  baseURL as FMarketBaseURL,
} from "@/@core/services/f-market/service";

export const LIST_WICHART_API: Request[] = [
  {
    url: "https://wifeed.vn/api/thong-tin-co-phieu/danh-sach-ma-chung-khoan?loaidn=1&san=HOSE",
    name: "Danh sách mã chứng khoán",
    id: "1",
    service: null,
  },
  {
    url: "https://wifeed.vn/api/thong-bao-api/cap-nhat-du-lieu?page=1&limit=100",
    name: "Thông báo cập nhật dữ liệu",
    id: "2",
    service: null,
  },
];

export const LIST_DEVTO_API: Request[] = Object.keys(DevToUrls).map((key) => {
  let schema;
  if (key === "search") {
    schema = SearchResponseSchema;
  } else if (key === "stories") {
    schema = StoriesResponseSchema;
  }

  return {
    url: DevToBaseURL + DevToUrls[key](),
    name: key,
    id: key,
    schema,
    service: DevToService,
  };
});

export const LIST_FIREANT_API: Request[] = Object.keys(FireantUrls).map(
  (key) => {
    let schema;
    if (key === "fundamental") {
      schema = FundamentalSchema;
    } else if (key === "news") {
      schema = PostSchema;
    } else if (key === "posts") {
      schema = PostSchema;
    } else if (key === "watchlists") {
      schema = WatchlistsSchema;
    } else if (key === "profile") {
      schema = ProfileSchema;
    } else if (key === "rrg") {
      schema = RrgSchema;
    } else if (key === "financialReports") {
      schema = FinancialReportSchema;
    } else if (key === "historicalPrice") {
      schema = HistoricalPriceSchema;
    } else if (key === "timescaleMarks") {
      schema = TimescaleMarksSchema;
    } else if (key === "officers") {
      schema = OfficersSchema;
    } else if (key === "subsidiaries") {
      schema = SubsidiariesSchema;
    } else if (key === "holders") {
      schema = HoldersSchema;
    } else if (key === "dividends") {
      schema = DividendsSchema;
    } else if (key === "events") {
      schema = EventsSchema;
    } else if (key === "financialIndicators") {
      schema = FinancialIndicatorsSchema;
    }

    return {
      url: FireantBaseURL + FireantUrls[key](),
      name: key,
      id: key,
      schema,
      service: FireantService,
    };
  }
);

export const LIST_FMARKET_API: Request[] = Object.keys(FMarketUrls).map(
  (key) => {
    let schema;
    if (key === "getNavHistory") {
      schema = NavHistoryResponseSchema;
    } else if (key === "filterProducts") {
      schema = FilterProductsResponseSchema;
    }

    return {
      url: FMarketBaseURL + FMarketUrls[key](),
      name: key,
      id: key,
      schema,
      service: FMarketService,
    };
  }
);

export type CompanyId = "wichart" | "fireant" | "devTo" | "fMarket";

export const LIST_API: {
  id: CompanyId;
  label: string;
  request: Request[];
}[] = [
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
  {
    id: "devTo",
    label: "Dev.to",
    request: LIST_DEVTO_API,
  },
  {
    id: "fMarket",
    label: "FMarket",
    request: LIST_FMARKET_API,
  },
];
