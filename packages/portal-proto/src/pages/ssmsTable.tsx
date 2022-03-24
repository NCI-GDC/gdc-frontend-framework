import { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
import MutationsTable from "../features/genomic/MutationsTable";

const SSMSTablePage: NextPage = () => {
  return (
    <SimpleLayout>
      <div >
          <MutationsTable />
      </div>
    </SimpleLayout>
  );
};

export default SSMSTablePage;
