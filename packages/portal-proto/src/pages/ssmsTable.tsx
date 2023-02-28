import { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
import { SMTableContainer } from "@/components/expandableTables/somaticMutations/SMTableContainer";

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
