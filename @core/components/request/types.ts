export type RequestLabel = {
  id: string;
  label: string;
  requestList: Request[];
};

export type Request = {
  url: string;
  name: string;
  id: number;
  parseResponse?: any;
};
