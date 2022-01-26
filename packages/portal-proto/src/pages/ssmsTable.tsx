import { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
import MutationTable from "../features/mutationTable/MutationTable";

const SSMSTablePage: NextPage = () => {
  return (
    <SimpleLayout>
      <div >
          <MutationTable pageSize={10} offset={0} />
      </div>
    </SimpleLayout>
  );
};

export default SSMSTablePage;
