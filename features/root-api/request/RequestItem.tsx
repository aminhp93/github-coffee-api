import { useRequestStore } from "../store/request";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { Request } from "./types";
import { Response } from "../response/types";

const getClassName = (request: Request, response: Response | null) => {
  if (!response) return "";
  if (response.status === "success") {
    if (!request.schema) {
      return "success warning";
    }
    return "success";
  } else {
    return "failed";
  }
};

type Props = {
  request: Request;
  response: Response | null;
};

const RequestItem = ({ request, response }: Props) => {
  const setRequest = useRequestStore((s) => s.setRequest);

  const handleClick = () => {
    setRequest(request);
  };

  const className = getClassName(request, response);

  return (
    <Box className={className}>
      <Box>{request.name}</Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {request.url}
        </Box>
        <Button onClick={handleClick}>Get</Button>
      </Box>
    </Box>
  );
};

export default RequestItem;
