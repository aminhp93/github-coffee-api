"use client";

import { Box } from "@mui/material";

import { Response } from "./types";
import { Request } from "../request/types";

type Props = {
  request: Request | null;
  response: Response | null;
};

const ResponseComponent = ({ request, response }: Props) => {
  return (
    <>
      {response && request ? (
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
              <pre>{JSON.stringify(request.name, null, 2)}</pre>
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
