import { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
// import GenesTable from "../features/genesTable/GenesTable";
import { GTableContainer } from "../components/expandableTables/genes/GTableContainer";

const GenesTablePage: NextPage = () => {
  return (
    <SimpleLayout>
      <div>
        {/* <GenesTable
          selectedSurvivalPlot={undefined}
          handleSurvivalPlotToggled={undefined}
        /> */}
        <GTableContainer twStyles=""></GTableContainer>
      </div>
    </SimpleLayout>
  );
};

export default GenesTablePage;
