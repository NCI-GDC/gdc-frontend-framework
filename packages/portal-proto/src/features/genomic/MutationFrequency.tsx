import { useEffect, useState } from "react";
import { GeneFrequencyChart } from "../charts/GeneFrequencyChart";
import GenesTable from "./GenesTable";
import MutationsTable from "./MutationsTable";
import { Grid, Tabs, LoadingOverlay } from "@mantine/core";
import { EnumFacet } from "../facets/EnumFacet";
import dynamic from "next/dynamic";
import {
  GqlOperation,
  selectCurrentCohortCaseGqlFilters, useCoreDispatch,
  useCoreSelector,
  useSurvivalPlot,
  fetchSurvival,
} from "@gff/core";



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
  },
];

const mergeFilters = (cohortFilters: GqlOperation, symbol: string) : ReadonlyArray<GqlOperation> => {
  /**
   * given the contents, add two filters, one with the gene and one without
   */

  if (symbol === undefined)
    return [];

  return ([{
    "op": "and",
    content:
      [...(cohortFilters ? cohortFilters.content as any  : []), {
        "op": "excludeifany",
        "content": {
          "field": "gene.symbol",
          "value": symbol,
        },
      }],
  },
    {
      op: "and", content:
        [ ...(cohortFilters ? cohortFilters.content as any  : []) , {
          "op": "=",
          "content": {
            "field": "gene.symbol",
            "value": symbol,
          },
        }],
    },
  ]);

};

const MutationFrequency: React.FC = () => {
  const coreDispatch = useCoreDispatch();
  const [geneAdditionalSurvival, setGeneAdditionalSurvival] = useState(undefined);
  const cohortFilters = useCoreSelector((state) => selectCurrentCohortCaseGqlFilters(state));
  const { data: survivalPlotData, isSuccess :survivalPlotReady } = useSurvivalPlot();

  const handleSurvivalPlotToggled = (symbol: string) => {
    if (geneAdditionalSurvival === symbol) { // remove toggle
      setGeneAdditionalSurvival(undefined);
      coreDispatch(fetchSurvival(undefined));
    } else {
      setGeneAdditionalSurvival(symbol);
      coreDispatch(fetchSurvival({  filters: mergeFilters(cohortFilters, symbol) } ));
    }
  };

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
                               hideIfEmpty={false}
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
                               hideIfEmpty={false}
                               description={x.description}
            />);
          })
          }
        </div>
        <Tabs classNames = {{
          root: "mt-4",
          tabLabel: "text-nci-gray-darkest",
          tabActive: "bg-nci-gray-lighter text-nci-gray-lightest"
        }}>
          <Tabs.Tab label="Genes">
            <div className="flex flex-row">
              <div className="flex flex-col">
                <Grid className="mx-2 bg-white"  >
                  <Grid.Col span={6}>
                    <GeneFrequencyChart marginBottom={95} />
                  </Grid.Col>
                  <Grid.Col span={6} className="relative">
                    <LoadingOverlay visible={!survivalPlotReady} />
                    <SurvivalPlot data={survivalPlotData} names={geneAdditionalSurvival ? [geneAdditionalSurvival] : []}/>
                  </Grid.Col>
                </Grid>
                  <GenesTable handleSurvivalPlotToggled={handleSurvivalPlotToggled} />
              </div>
            </div>
          </Tabs.Tab>
          <Tabs.Tab label="Mutations">
            <div className="flex flex-row">
              <div className="flex flex-col">
                <div className="w-3/4 h-auto bg-white ">
                  <SurvivalPlot data={survivalPlotData}/>
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
