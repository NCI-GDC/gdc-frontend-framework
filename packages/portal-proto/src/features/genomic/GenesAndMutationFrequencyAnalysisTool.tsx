import React, { useState } from "react";
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
import { GqlIntersection } from "@gff/core/dist/dts";



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

const buildGeneHaveAndHaveNotFilters = (cohortFilters: GqlOperation, symbol: string, field: string) : ReadonlyArray<GqlOperation> => {
  /**
   * given the contents, add two filters, one with the gene and one without
   */

  if (symbol === undefined)
    return [];

  console.log(cohortFilters);


  return ([{
    "op": "and",
    content:
      [...(cohortFilters ? cohortFilters.content as any  : []), { //TODO: refactor cohortFilters to be Union | Intersection
        "op": "excludeifany",
        "content": {
          "field": field,
          "value": symbol,
        },
      }],
  },
    {
      op: "and", content:
        [ ...(cohortFilters ? cohortFilters.content as any  : []) , {
          "op": "=",
          "content": {
            "field": field,
            "value": symbol,
          },
        }],
    },
  ]);

};

const GenesAndMutationFrequencyAnalysisTool: React.FC = () => {
  const coreDispatch = useCoreDispatch();
  const [comparativeSurvival, setComparativeSurvival] = useState(undefined);
  const cohortFilters = useCoreSelector((state) => selectCurrentCohortCaseGqlFilters(state));
  const { data: survivalPlotData, isSuccess :survivalPlotReady } = useSurvivalPlot();

  /**
   * Update survival plot in response to user actions. There are two "states"
   * for the survival plot: If comparativeSurvival is undefined it will show the
   * plot for the currentCohort plus whatever local filters are selected
   * If comparativeSurvival is set, then it will show two separate plots.
   * @param symbol
   * @param name symbol (Gene or SSMS) to compare
   * @param field field
   */
  const handleSurvivalPlotToggled = (symbol: string, name: string, field: string) => {
    if (comparativeSurvival && comparativeSurvival.symbol === symbol) { // remove toggle
      setComparativeSurvival(undefined);
      coreDispatch(fetchSurvival(undefined));
    } else {
      setComparativeSurvival({ symbol: symbol, name: name });
      coreDispatch(fetchSurvival({  filters: buildGeneHaveAndHaveNotFilters(cohortFilters, symbol, field) } ));
    }
  };


  /**
   * remove comparative survival plot when tabs or filters change.
   * TODO: Reset table survival button state
   */
  const handleTabOrFilterChanged = () => {
    setComparativeSurvival(undefined);
    coreDispatch(fetchSurvival(undefined));
  }

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
        }}
              onTabChange={ () => {handleTabOrFilterChanged() }}
        >
          <Tabs.Tab label="Genes">
            <div className="flex flex-row">
              <div className="flex flex-col">
                <Grid className="mx-2 bg-white"  >
                  <Grid.Col span={6}>
                    <GeneFrequencyChart marginBottom={95} />
                  </Grid.Col>
                  <Grid.Col span={6} className="relative">
                    <LoadingOverlay visible={!survivalPlotReady} />
                    <SurvivalPlot data={survivalPlotData} names={!survivalPlotReady ? [] :  comparativeSurvival ? [comparativeSurvival.name] : []}/>
                  </Grid.Col>
                </Grid>
                  <GenesTable handleSurvivalPlotToggled={(symbol: string ,name: string ) => handleSurvivalPlotToggled(symbol, name, "gene.symbol")} />
              </div>
            </div>
          </Tabs.Tab>
          <Tabs.Tab label="Mutations">
            <div className="flex flex-row">
              <div className="flex flex-col">
                <div className="w-3/4 h-auto bg-white relative">
                  <LoadingOverlay visible={!survivalPlotReady} />
                  <SurvivalPlot data={survivalPlotData} names={!survivalPlotReady ? [] : comparativeSurvival ? [comparativeSurvival.name] : []}/>
                </div>
              <MutationsTable handleSurvivalPlotToggled={(symbol: string ,name: string  ) => handleSurvivalPlotToggled(symbol, name, "gene.ssm.ssm_id")} />
            </div>
            </div>
          </Tabs.Tab>
        </Tabs>
    </div>
  );
};

export default GenesAndMutationFrequencyAnalysisTool;
