import { GeneFrequencyChart } from "../charts/GeneFrequencyChart";
import { SurvivalPlot } from "../charts/SurvivalPlot";
import GenesTable from "./GenesTable";
import MutationsTable from "./MutationsTable";
import { Tabs } from '@mantine/core';
import { MdInsertChartOutlined as SummaryChartIcon } from "react-icons/md";
import SomanticMutationFilterFixedVersion from "../genomic/SomanticMutationFilter"
import MutationFacet from "../cohortBuilder/MutationFacet";
import { EnumFacet } from "../facets/EnumFacet";

const GenesFacetNames = [
  {
    facet_filter: "biotype",
    name: "Biotype",
    description: "No description",
  },
  {
    facet_filter: "is_cancer_gene_census",
    name: "Is Cancer Gene Census",
    description: "No description",
  }
];


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
              <div className="flex flex-col gap-y-4 mr-3">
                {GenesFacetNames.map((x, index) => {
                  return (<EnumFacet key={`${x.facet_filter}-${index}`}
                                     field={`${x.facet_filter}`}
                                     facetName={x.name}
                                     type="genes"
                                     showPercent={false}
                                     valueLabel="Genes"
                                     description={x.description}
                  />);
                })
                }
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
