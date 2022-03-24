import { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
import GenesTable from "../features/genomic/GenesTable";

const GenesTablePage: NextPage = () => {
  return (
    <SimpleLayout>
      <div >
          <GenesTable/>
      </div>
    </SimpleLayout>
  );
};

export default GenesTablePage;
