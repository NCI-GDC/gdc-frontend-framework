import { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
import GenesTable from "../features/genesTable/GenesTable";

const GenesTablePage: NextPage = () => {
  const handleSurvivalPlotToggled = () => {
    return;
  };
  const selectedSurvivalPlot = "";
  return (
    <SimpleLayout>
      <div>
        <GenesTable
          handleSurvivalPlotToggled={handleSurvivalPlotToggled}
          selectedSurvivalPlot={selectedSurvivalPlot}
        />
      </div>
    </SimpleLayout>
  );
};

export default GenesTablePage;
