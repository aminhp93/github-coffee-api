/* eslint-disable @typescript-eslint/no-explicit-any */

export type RequestLabel = {
  id: string;
  label: string;
  requestList: Request[];
};

export type Request = {
  url: string;
  name: string;
  id: string;
  parseResponse?: any;
};
