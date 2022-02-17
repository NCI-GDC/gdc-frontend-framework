import { GeneFrequencyChart } from "../charts/GeneFrequencyChart";
import { SurvivalPlot } from "../charts/SurvivalPlot";
import GenesTable from "../genesTable/GenesTable";
import MutationTable from "../mutationTable/MutationTable";

const MutationFrequency: React.FC = () => {
  return (

      <div className="flex flex-col">
        <div className="flex flex-row">
          <div className="w-1/2">
        <GeneFrequencyChart></GeneFrequencyChart>
          </div>
          <div className="w-1/2 h-96">
          <SurvivalPlot  marginBottom={30}></SurvivalPlot>
      </div>
      </div>
      <div className="flex flex-row">
        <div className="m-4">
        <GenesTable ></GenesTable>
        </div>
        <div className="m-4">
        <MutationTable></MutationTable>
        </div>
      </div>
    </div>
  );
};

export default MutationFrequency;
