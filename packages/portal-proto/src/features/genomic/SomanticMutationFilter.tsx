import { GeneTable, MutationTable } from "./Genomic";
import MutationFacet from "../cohortBuilder/MutationFacet";
import {
  BIOTYPE,
  CONSEQUENCE_TYPE,
  SIFT_IMPACT,
  VARIANT_CALLER,
  VEP_IMPACT,
} from "../cohortBuilder/gene_mutation_facets";
import GeneData from "./genes.json";

interface SomaticAppPropsProps {
  readonly gene_data?: Array<Record<string, any>>;
  readonly mutations_data?: Array<Record<string, any>>;
  readonly description?: string;

}

const SomanticMutationFilter: React.FC<SomaticAppPropsProps> = ({ gene_data = GeneData["MostFrequentGenes"] }: SomaticAppPropsProps) => {
  return (
    <div className="flex flex-row">
      <div className="flex flex-col">
        <GeneTable data={gene_data} width="0" />
        <MutationFacet field={"Biotype"} description={""} data={BIOTYPE} type={"Genes"} />
      </div>
      <div className="flex flex-col">
        <MutationTable width="0" />
        <div className="grid grid-cols-2 gap-4">
          <MutationFacet field={"VEP Impact"} description={""} data={VEP_IMPACT} />
          <MutationFacet field={"Variant Caller"} description={""} data={VARIANT_CALLER} />
          <MutationFacet field={"Consequence Type"} description={""} data={CONSEQUENCE_TYPE} />
          <MutationFacet field={"SIFT Impact"} description={""} data={SIFT_IMPACT} />
        </div>
      </div>
    </div>
  );
};

export default SomanticMutationFilter;


