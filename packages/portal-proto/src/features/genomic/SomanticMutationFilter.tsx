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
import MutationData from "./mutations.json";
import dynamic from "next/dynamic";
import { MdSearch } from "react-icons/md";

interface SomaticAppProps {
  readonly gene_data?: Array<Record<string, any>>;
  readonly mutations_data?: Array<Record<string, any>>;
  readonly description?: string;
}

const GeneChartWithNoSSR = dynamic(() => import("./Charts"), {
  ssr: false,
});

const SomanticMutationFilterFixedVersion: React.FC<SomaticAppProps> = ({
                                                                         gene_data = GeneData["MostFrequentGenes"],
                                                                         mutations_data = MutationData["MostFrequentMutation"],
                                                                       }: SomaticAppProps) => {
  return (
    <div className="flex flex-row">
      <div className="flex flex-col">
        <div className="flex flex-col">
          <div className="h-44">
            <MutationFacet field={"Biotype"} description={""} data={BIOTYPE} type={"Genes"} />
          </div>
          <div className="flex flex-row justify-center bg-white border-r-2  border-nci-gray-light">
            <GeneChartWithNoSSR which="gene" />
          </div>
          <div className="flex flex-row justify-center items-center w-full ">
            <div className="relative">
              <div className="p-2"><input type="text"
                                          className="h-2 w-64 pr-8 pl-5 border-nci-gray-light rounded-full z-0 focus:shadow focus:outline-none"
                                          placeholder={`Search Genes`} />
                <div className="absolute top-3 right-3 h-4"><MdSearch size="1.25em" />
                </div>
              </div>
            </div>
          </div>
          <GeneTable data={gene_data} width="0" />
        </div>
      </div>
      <div className="flex flex-col relative ">
        <div className="flex flex-col">

          <div className="h-44">
            <div className="grid grid-cols-2 gap-2">
              <MutationFacet field={"VEP Impact"} description={""} data={VEP_IMPACT} />
              <MutationFacet field={"Variant Caller"} description={""} data={VARIANT_CALLER} />
              <MutationFacet field={"Consequence Type"} description={""} data={CONSEQUENCE_TYPE} />
              <MutationFacet field={"SIFT Impact"} description={""} data={SIFT_IMPACT} />
            </div>
          </div>
            <div className="flex flex-row justify-center bg-white">
              <GeneChartWithNoSSR which="mutation" />
            </div>
            <div className="flex flex-row justify-center items-center w-full ">
              <div className="relative ">
                <div className="p-2"><input type="text"
                                            className="h-2 w-64 pr-8 pl-5 border-nci-gray-light rounded-full z-0 focus:shadow focus:outline-none"
                                            placeholder={`Search Mutations`} />
                  <div className="absolute top-3 right-3 h-4"><MdSearch size="1.25em" />
                  </div>
                </div>
              </div>
            </div>
            <MutationTable data={mutations_data} width="0" />

          </div>
        </div>

      </div>

  );
};

export default SomanticMutationFilterFixedVersion;


