import GenesTable from "../genesTable/GenesTable";
import MutationsTable from "../mutationsTable/MutationsTable";
import MutationFacet from "../cohortBuilder/MutationFacet";
import {
  BIOTYPE,
  CONSEQUENCE_TYPE,
  SIFT_IMPACT,
  VARIANT_CALLER,
  VEP_IMPACT,
} from "./gene_mutation_facets";
import dynamic from "next/dynamic";
import { MdSearch } from "react-icons/md";

const GeneChartWithNoSSR = dynamic(() => import("./Charts"), {
  ssr: false,
});

const SomanticMutationFilterFixedVersion: React.FC = () => {
  return (
    <div className="flex flex-row">
      <div className="flex flex-col">
        <div className="flex flex-col">
          <div className="grid grid-cols-1 gap-3">
            <MutationFacet
              field={"Biotype"}
              description={""}
              data={BIOTYPE}
              type={"Genes"}
            />
            <div className="p-10"></div>
          </div>
          <div className="flex flex-row justify-center bg-base-lightest border-r-2  border-base-light">
            <GeneChartWithNoSSR which="gene" />
          </div>
          <div className="flex flex-row justify-center items-center w-full ">
            <div className="relative">
              <div className="p-2">
                <input
                  type="text"
                  className="h-2 w-64 pr-8 pl-5 border-base-light rounded-full z-0 focus:shadow focus:outline-none"
                  placeholder={`Search Genes`}
                />
                <div className="absolute top-3 right-3 h-4">
                  <MdSearch size="1.25em" />
                </div>
              </div>
            </div>
          </div>
          <GenesTable
            selectedSurvivalPlot={undefined}
            handleSurvivalPlotToggled={undefined}
          />
        </div>
      </div>
      <div className="flex flex-col relative ">
        <div className="flex flex-col">
          <div>
            <div className="grid grid-cols-2 gap-2">
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
          <div className="flex flex-row justify-center bg-base-lightest mt-2">
            <GeneChartWithNoSSR which="mutation" />
          </div>
          <div className="flex flex-row justify-center items-center w-full ">
            <div className="relative ">
              <div className="p-2">
                <input
                  type="text"
                  className="h-2 w-64 pr-8 pl-5 border-base-light rounded-full z-0 focus:shadow focus:outline-none"
                  placeholder={`Search Mutations`}
                />
                <div className="absolute top-3 right-3 h-4">
                  <MdSearch size="1.25em" />
                </div>
              </div>
            </div>
          </div>
          <MutationsTable
            selectedSurvivalPlot={undefined}
            handleSurvivalPlotToggled={undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default SomanticMutationFilterFixedVersion;
