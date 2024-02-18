import { LIST_WICHART_API } from "../../constants";
import Request from "../request";

const WichartPage = ({ allResponses, response }: any) => {
  return (
    <div>
      <div>Wichart</div>
      <br />
      <Request
        data={LIST_WICHART_API}
        allResponses={allResponses}
        response={response}
      />
    </div>
  );
};

export default WichartPage;
