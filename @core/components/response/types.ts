/* eslint-disable @typescript-eslint/no-explicit-any */

export type Response = {
  status: Status;
  url: string;
  data: any;
};

export type Status = "success" | "failed";
