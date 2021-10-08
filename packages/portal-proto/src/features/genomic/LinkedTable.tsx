import { GeneTable, MutationTable} from "../genomic/Genomic";
import Sankey from "./Sankey";
import GeneData from "./genes.json";
import MutationData from "./mutations.json";

const createData = (geneData, mutationData) => {
  // create the gene nodes
}

const LinkedTable = () => {
  return (
    <div>
      <div className="flex flex-row">
          <GeneTable />
        <MutationTable />
      </div>
    </div>
  )
}

export default LinkedTable;
