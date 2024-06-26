import { Box, styled } from "@mui/material";
import { red, green } from "@mui/material/colors";
import RequestItem from "./RequestItem";
import { Request } from "./types";
import { Response } from "../response/types";

type Props = {
  requestList: Request[];
  allResponses: Response[];
  response: Response | null;
};

const RequestComponent = ({ requestList, allResponses, response }: Props) => {
  return (
    <StyledBox>
      {requestList.map((i) => {
        // find response for each request
        const finalResponse =
          allResponses.find((r) => r.url === i.url) ??
          (response?.url && response.url === i.url ? response : null);

        if (!finalResponse) return null;

        return <RequestItem key={i.url} request={i} response={finalResponse} />;
      })}
    </StyledBox>
  );
};

export default RequestComponent;

const StyledBox = styled(Box)(({ theme }) => ({
  "& > div:nth-of-type(even)": {
    backgroundColor: theme.palette.grey[200],
  },
  "& > div:nth-of-type(odd)": {
    backgroundColor: theme.palette.grey[300],
  },
  "& > div": {
    padding: "10px",
    "&.success": {
      backgroundColor: green[200],
    },
    "&.failed": {
      backgroundColor: red[200],
    },
  },
}));
