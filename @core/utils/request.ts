import { Request } from "@/features/root-api/request/types";

export const getRequest = (request: Request | null) => {
  if (
    !request ||
    !request.service ||
    !request.name ||
    !request.service[request.name]
  )
    return;

  return request.service[request.name]();
};
