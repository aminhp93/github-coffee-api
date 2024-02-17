import { Button } from "@mui/material";
import { useRequestStore } from "./store";

const Request = ({ data }: any) => {
  console.log("wirchat page");
  return (
    <div>
      <br />
      {data.map((i: any) => {
        return <RequestItem key={i.url} item={i} />;
      })}
    </div>
  );
};

const RequestItem = ({ item }: any) => {
  const setRequest = useRequestStore((s) => s.setRequest);

  const handleClick = () => {
    setRequest(item);
  };

  return (
    <div>
      <div>{item.name}</div>
      <span>{item.url}</span>
      <Button onClick={handleClick}>Get</Button>
    </div>
  );
};

export default Request;
