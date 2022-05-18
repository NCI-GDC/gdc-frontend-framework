import { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
import MutationsTable from "../features/mutationsTable/MutationsTable";

const SSMSTablePage: NextPage = () => {
  return (
    <SimpleLayout>
      <div>
        <MutationsTable
          selectedSurvivalPlot={undefined}
          handleSurvivalPlotToggled={undefined}
        />
      </div>
    </SimpleLayout>
  );
};

export default SSMSTablePage;
