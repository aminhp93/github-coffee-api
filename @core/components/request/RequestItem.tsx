import { useRequestStore } from "../../store/request";
import { Button, Box } from "@mui/material";
import { Request } from "./types";
import { Response } from "../response/types";

const getClassName = (response: Response) => {
  if (!response) return "";
  return response.status === "success" ? "success" : "failed";
};

type Props = {
  request: Request;
  response: Response;
};

const RequestItem = ({ request, response }: Props) => {
  const setRequest = useRequestStore((s) => s.setRequest);

  const handleClick = () => {
    setRequest(request);
  };

  const className = getClassName(response);

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
