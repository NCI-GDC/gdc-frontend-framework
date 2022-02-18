import { GeneFrequencyChart } from "../charts/GeneFrequencyChart";
import { SurvivalPlot } from "../charts/SurvivalPlot";
import GenesTable from "./GenesTable";
import MutationsTable from "./MutationsTable";
import { Tabs } from '@mantine/core';
import { MdInsertChartOutlined as SummaryChartIcon } from "react-icons/md";
import SomanticMutationFilterFixedVersion from "../genomic/SomanticMutationFilter"
import MutationFacet from "../cohortBuilder/MutationFacet";
import { CONSEQUENCE_TYPE, SIFT_IMPACT, VARIANT_CALLER, VEP_IMPACT } from "../cohortBuilder/gene_mutation_facets";

const SideBySideCharts : React.FC = () => {
  return (
  <div className="flex flex-row justify-items-end">
    <div className="w-1/2 ">
      <GeneFrequencyChart />
    </div>
    <div className="w-1/2">
      <SurvivalPlot  marginBottom={30}></SurvivalPlot>
    </div>
  </div>
    );
}

const MutationFrequency: React.FC = () => {
  return (
      <div className="flex flex-col">
        <Tabs position="right" variant="pills" >
          <Tabs.Tab label="Genes">
            <div className="flex flex-row">
              <div className="flex flex-col justify-end">
                <MutationFacet field={"VEP Impact"} description={""} data={VEP_IMPACT} />
                <MutationFacet field={"Variant Caller"} description={""} data={VARIANT_CALLER} />
                <MutationFacet field={"Consequence Type"} description={""} data={CONSEQUENCE_TYPE} />
                <MutationFacet field={"SIFT Impact"} description={""} data={SIFT_IMPACT} />
              </div>
              <div className="flex flex-col">
                  <SideBySideCharts />
                  <GenesTable ></GenesTable>
              </div>
            </div>
          </Tabs.Tab>
          <Tabs.Tab label="Mutations">
            <div className="flex flex-col">

              <SurvivalPlot  marginBottom={30}></SurvivalPlot>

              <MutationsTable />
            </div>
          </Tabs.Tab>
        </Tabs>
    </div>
  );
};

export default MutationFrequency;
