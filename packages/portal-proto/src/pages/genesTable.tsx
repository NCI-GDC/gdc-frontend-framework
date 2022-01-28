import { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
import GenesTable from "../features/genesTable/GenesTable";

const GenesTablePage: NextPage = () => {
  return (
    <SimpleLayout>
      <div >
          <GenesTable pageSize={10} offset={0} />
      </div>
    </SimpleLayout>
  );
};

export default GenesTablePage;
