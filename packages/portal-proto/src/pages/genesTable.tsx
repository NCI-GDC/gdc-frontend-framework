import { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
import GenesTable from "../features/genesTable/GenesTable";

const GenesTablePage: NextPage = () => {
  return (
    <SimpleLayout>
      <div>
        <GenesTable
          selectedSurvivalPlot={undefined}
          handleSurvivalPlotToggled={undefined}
        />
      </div>
    </SimpleLayout>
  );
};

export default GenesTablePage;
