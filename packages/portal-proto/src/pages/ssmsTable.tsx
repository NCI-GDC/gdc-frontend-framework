import { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
import { SMTableContainer } from "@/features/SomaticMutations/SMTableContainer";

const SSMSTablePage: NextPage = () => {
  return (
    <SimpleLayout>
      <div>
        <SMTableContainer />
      </div>
    </SimpleLayout>
  );
};

export default SSMSTablePage;
