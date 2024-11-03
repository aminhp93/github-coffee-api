/* eslint-disable @typescript-eslint/no-explicit-any */
import { CompanyId } from "@/features/root-api/constants";

export type RequestLabel = {
  id: string;
  label: string;
  requestList: Request[];
};

export type Request = {
  url: string;
  name: string;
  id: string;
  schema?: any;
  companyId?: CompanyId;
  service: any;
};
