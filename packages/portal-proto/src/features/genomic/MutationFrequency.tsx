import { GeneFrequencyChart } from "../charts/GeneFrequencyChart";
import GenesTable from "./GenesTable";
import MutationsTable from "./MutationsTable";
import { Tabs } from '@mantine/core';
import { EnumFacet } from "../facets/EnumFacet";
import dynamic from "next/dynamic";

const SurvivalPlot = dynamic(() => import("../charts/SurvivalPlot"), {
  ssr: false,
});


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

const MutationFacetNames = [
  {
    facet_filter: "consequence.transcript.annotation.vep_impact",
    name: "VEP Impact",
    description: "No description",
  },
  {
    facet_filter: "consequence.transcript.annotation.sift_impact",
    name: "SIFT Impact",
    description: "No description",
  },
  {
    facet_filter: "consequence.transcript.annotation.polyphen_impact",
    name: "Polyphen Impact",
    description: "No description",
  },
  {
    facet_filter: "consequence.transcript.consequence_type",
    name: "Consequence Type",
    description: "No description",
  },
  {
    facet_filter: "mutation_subtype",
    name: "Type",
    description: "No description",
  }
];


const SideBySideCharts : React.FC = () => {
  return (
  <div className="flex flex-row">
    <div className="w-1/2">
      <GeneFrequencyChart marginBottom={95} />
    </div>
    <div className="w-1/2 bg-white ">
      <SurvivalPlot/>
    </div>
  </div>
    );
}

const MutationFrequency: React.FC = () => {
  return (
      <div className="flex flex-row">
        <div className="flex flex-col gap-y-4 mr-3 mt-12 w-min-64 w-max-64">
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
          {MutationFacetNames.map((x, index) => {
            return (<EnumFacet key={`${x.facet_filter}-${index}`}
                               field={`${x.facet_filter}`}
                               facetName={x.name}
                               type="ssms"
                               showPercent={false}
                               valueLabel="Mutations"
                               description={x.description}
            />);
          })
          }
        </div>
        <Tabs>
          <Tabs.Tab label="Genes">
            <div className="flex flex-row">
              <div className="flex flex-col">
                  <SideBySideCharts />
                  <GenesTable />
              </div>
            </div>
          </Tabs.Tab>
          <Tabs.Tab label="Mutations">
            <div className="flex flex-row">
              <div className="flex flex-col">
                <div className="w-3/4 h-auto bg-white ">
                  <SurvivalPlot />
                </div>
              <MutationsTable />
            </div>
            </div>
          </Tabs.Tab>
        </Tabs>
    </div>
  );
};

export default MutationFrequency;
