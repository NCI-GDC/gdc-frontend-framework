import { GeneFrequencyChart } from "../charts/GeneFrequencyChart";
import GenesTable from "../genesTable/GenesTable";

const SomanticMutations : React.FC = () => {
  return (
    <div className="flex flex-col w-100">
      <div className="flex flex-row">
        <GeneFrequencyChart></GeneFrequencyChart>
      </div>
      <GenesTable></GenesTable>
    </div>
  )
}

export default SomanticMutations;
