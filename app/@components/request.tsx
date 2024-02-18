import { Button, Box, styled } from "@mui/material";
import { red, green } from "@mui/material/colors";
import { useRequestStore } from "../store";

const Request = ({ data, allResponses, response }: any) => {
  return (
    <StyledBox>
      {data.map((i: any) => {
        // find response for each request
        const finalResponse =
          allResponses.find((r: any) => r.url === i.url) ||
          (response?.url && response.url === i.url ? response : null);

        return <RequestItem key={i.url} item={i} response={finalResponse} />;
      })}
    </StyledBox>
  );
};

const RequestItem = ({ item, response }: any) => {
  const setRequest = useRequestStore((s) => s.setRequest);

  const handleClick = () => {
    setRequest(item);
  };

  const className = response
    ? response.status === "success"
      ? "success"
      : "failed"
    : "";

  return (
    <Box className={className}>
      <Box>{item.name}</Box>
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
          {item.url}
        </Box>
        <Button onClick={handleClick}>Get</Button>
      </Box>
    </Box>
  );
};

export default Request;

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
