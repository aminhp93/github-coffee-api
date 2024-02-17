import { LIST_WICHART_API } from "../constants";
import Request from "../request";

const WichartPage = () => {
  console.log("wirchat page");
  return (
    <div>
      <div>Wichart</div>
      <br />
      <Request data={LIST_WICHART_API} />
    </div>
  );
};

export default WichartPage;
