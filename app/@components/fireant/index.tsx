import { LIST_FIREANT_API } from "../../constants";
import Request from "../request";

const FireantPage = ({ allResponses, response }: any) => {
  return (
    <div>
      <div>Fireant</div>
      <br />
      <Request
        data={LIST_FIREANT_API}
        allResponses={allResponses}
        response={response}
      />
    </div>
  );
};

export default FireantPage;
