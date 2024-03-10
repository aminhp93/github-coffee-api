"use client";

import { Box } from "@mui/material";
import { getRequest } from "../../../app/utils";
import { ResponseType } from "../../../app/schema";

type Props = {
  requestObject: {
    token: string;
    url?: string;
  };
  responseData: ResponseType;
};

const Response = ({ requestObject, responseData }: Props) => {
  const requestData = getRequest(requestObject.token, requestObject.url);
  return (
    <>
      {responseData && requestData ? (
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
              <pre>{JSON.stringify(responseData, null, 2)}</pre>
            </Box>
          </Box>
        </Box>
      ) : (
        "No response"
      )}
    </>
  );
};

export default Response;
