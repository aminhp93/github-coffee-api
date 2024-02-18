"use client";

import { Box } from "@mui/material";

export default function Response({ requestData, responseData }: any) {
  return (
    <>
      {responseData ? (
        <>
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
        </>
      ) : (
        "No response"
      )}
    </>
  );
}
