import { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
import MutationTable from "../features/mutationTable/MutationTable";

const SSMSTablePage: NextPage = () => {
  return (
    <SimpleLayout>
      <div >
          <MutationTable />
      </div>
    </SimpleLayout>
  );
};

export default SSMSTablePage;
