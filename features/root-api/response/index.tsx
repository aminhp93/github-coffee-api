"use client";

import Box from "@mui/material/Box";

import { getRequest } from "../../../@core/services/utils";
import { Response } from "./types";

type Props = {
  requestObject: {
    token: string;
    url?: string;
  };
  response: Response | null;
};

const ResponseComponent = ({ requestObject, response }: Props) => {
  const requestData = getRequest(requestObject.token, requestObject.url);
  return (
    <>
      {response && requestData ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            // make each children overflow scroll
            "& > *": {
              overflow: "auto",
            },
          }}
        >
          <Box>
            <Box>Request</Box>
            <Box>
              <pre>{JSON.stringify(requestData, null, 2)}</pre>
            </Box>
          </Box>
          <Box>
            <Box>Response</Box>
            <Box>
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </Box>
          </Box>
        </Box>
      ) : (
        "No response"
      )}
    </>
  );
};

export default ResponseComponent;
