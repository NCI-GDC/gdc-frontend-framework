// TODO: Depreciate/remove this file

import { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
import { GTableContainer } from "../components/expandableTables/genes/GTableContainer";

const GenesTablePage: NextPage = () => {
  return (
    <SimpleLayout>
      <div>
        <GTableContainer
          selectedSurvivalPlot={undefined}
          handleSurvivalPlotToggled={undefined}
          handleGeneToggled={() => null}
        />
      </div>
    </SimpleLayout>
  );
};

export default GenesTablePage;
