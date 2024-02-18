import { LIST_FIREANT_API } from "../../constants";
import Request from "../request";

const FireantPage = () => {
  console.log("wirchat page");
  return (
    <div>
      <div>Fireant</div>
      <br />
      <Request data={LIST_FIREANT_API} />
    </div>
  );
};

export default FireantPage;
