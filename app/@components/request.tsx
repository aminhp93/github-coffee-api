import { Button, Box, styled } from "@mui/material";
// import red color from mui
import { yellow, green } from "@mui/material/colors";
import { useRequestStore } from "../store";

const Request = ({ data }: any) => {
  console.log("wirchat page");
  return (
    <StyledBox>
      {data.map((i: any) => {
        return <RequestItem key={i.url} item={i} />;
      })}
    </StyledBox>
  );
};

const RequestItem = ({ item }: any) => {
  const setRequest = useRequestStore((s) => s.setRequest);

  const handleClick = () => {
    setRequest(item);
  };

  return (
    <Box>
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
    backgroundColor: green[200],
  },
  "& > div:nth-of-type(odd)": {
    backgroundColor: yellow[200],
  },
}));
