import {styled} from "@mui/material";
import Box from "@mui/material/Box";

import { red, green, yellow } from "@mui/material/colors";
import RequestItem from "./RequestItem";
import { Request } from "./types";
import { Response } from "../response/types";
import { CompanyId } from "@/features/root-api/constants";

type Props = {
  companyId: CompanyId;
  requestList: Request[];
  allResponses: Response[];
  response: Response | null;
};

const RequestComponent = ({
  requestList,
  allResponses,
  response,
  companyId,
}: Props) => {
  return (
    <StyledBox>
      {requestList.map((i) => {
        // find response for each request
        const finalResponse =
          allResponses.find((r) => r.url === i.url) ??
          (response?.url && response.url === i.url ? response : null);

        return (
          <RequestItem
            key={i.url}
            request={{ ...i, companyId }}
            response={finalResponse}
          />
        );
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
      "&.warning": {
        backgroundColor: yellow[200],
      },
      backgroundColor: green[200],
    },
    "&.failed": {
      backgroundColor: red[200],
    },
  },
}));
