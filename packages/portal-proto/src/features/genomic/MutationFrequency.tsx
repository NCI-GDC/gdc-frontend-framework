import { GeneFrequencyChart } from "../charts/GeneFrequencyChart";
import { SurvivalPlot } from "../charts/SurvivalPlot";
import GenesTable from "../genesTable/GenesTable";
import MutationTable from "../mutationTable/MutationTable";

const MutationFrequency: React.FC = () => {
  return (
    <div className="flex flex-row">
      <div className="flex flex-col">
        <GeneFrequencyChart></GeneFrequencyChart>
        <GenesTable></GenesTable>
      </div>
      <div className="flex flex-col">
        <SurvivalPlot  height={200} marginBottom={30}></SurvivalPlot>
        <MutationTable></MutationTable>
      </div>
    </div>
  );
};

export default MutationFrequency;
