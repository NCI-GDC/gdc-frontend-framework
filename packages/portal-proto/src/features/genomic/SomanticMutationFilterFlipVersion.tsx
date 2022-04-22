import GenesTable from "./GenesTable";
import MutationsTable from "./MutationsTable";
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
import { useState } from "react";
import { MdFlip as FlipIcon, MdSearch } from "react-icons/md";

interface SomaticAppProps {
  readonly gene_data?: Array<Record<string, any>>;
  readonly mutations_data?: Array<Record<string, any>>;
  readonly description?: string;
}

const GeneChartWithNoSSR = dynamic(() => import("./Charts"), {
  ssr: false,
});

const SomanticMutationFilterFlipVersion: React.FC<SomaticAppProps> = ({
  gene_data = GeneData["MostFrequentGenes"],
  mutations_data = MutationData["MostFrequentMutation"],
}: SomaticAppProps) => {
  const [showGeneChart, setShowGeneChart] = useState(false);
  const [showMutationChart, setShowMutationChart] = useState(false);

  const toggleGeneFlip = () => {
    setShowGeneChart(!showGeneChart);
  };

  const toggleMutationFlip = () => {
    setShowMutationChart(!showMutationChart);
  };

  return (
    <div className="flex flex-row">
      <div className="flex flex-col relative">
        <div className="flex flex-col">
          <div className="flex flex-row items-center w-full border-2 border-nci-blue-lighter">
            <div className="relative justify-center ml-auto ">
              <div className="p-2">
                <input
                  type="text"
                  className="h-2 w-64 pr-8 pl-5 border-nci-gray-light rounded-full z-0 focus:shadow focus:outline-none"
                  placeholder={`Search Genes`}
                />
                <div className="absolute top-3 right-3 h-4">
                  <MdSearch size="1.25em" />
                </div>
              </div>
            </div>
            <div className="ml-auto">
              <button
                className="hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded"
                onClick={toggleGeneFlip}
              >
                <FlipIcon />
              </button>
            </div>
          </div>
          <div
            className={
              !showGeneChart ? "flip-card " : "flip-card flip-card-flipped "
            }
          >
            <div className="card-face bg-white">
              <GenesTable />
            </div>
            <div className="card-face card-back bg-white">
              <div className="flex flex-row justify-center bg-white border-2 border-nci-blumine-lighter">
                <GeneChartWithNoSSR which="gene" />
              </div>
            </div>
          </div>
        </div>
        <div>
          <MutationFacet
            field={"Biotype"}
            description={""}
            data={BIOTYPE}
            type={"Genes"}
          />
        </div>
      </div>
      <div className="flex flex-col relative ">
        <div className="flex flex-col">
          <div className="flex flex-row items-center w-full border-2 border-nci-blue-lighter ">
            <div className="relative justify-center ml-auto ">
              <div className="p-2">
                <input
                  type="text"
                  className="h-2 w-64 pr-8 pl-5 border-nci-gray-light rounded-full z-0 focus:shadow focus:outline-none"
                  placeholder={`Search Mutations`}
                />
                <div className="absolute top-3 right-3 h-4">
                  <MdSearch size="1.25em" />
                </div>
              </div>
            </div>
            <div className="ml-auto">
              <button
                className="hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded"
                onClick={toggleMutationFlip}
              >
                <FlipIcon />
              </button>
            </div>
          </div>
          <div
            className={
              !showMutationChart ? "flip-card " : "flip-card flip-card-flipped "
            }
          >
            <div className="card-face bg-white">
              <MutationsTable />
            </div>
            <div className="card-face card-back bg-white">
              <div className="flex flex-row justify-center bg-white border-2 border-nci-blumine-lighter">
                <GeneChartWithNoSSR which="mutation" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <MutationFacet
            field={"VEP Impact"}
            description={""}
            data={VEP_IMPACT}
          />
          <MutationFacet
            field={"Variant Caller"}
            description={""}
            data={VARIANT_CALLER}
          />
          <MutationFacet
            field={"Consequence Type"}
            description={""}
            data={CONSEQUENCE_TYPE}
          />
          <MutationFacet
            field={"SIFT Impact"}
            description={""}
            data={SIFT_IMPACT}
          />
        </div>
      </div>
    </div>
  );
};

export default SomanticMutationFilterFlipVersion;
