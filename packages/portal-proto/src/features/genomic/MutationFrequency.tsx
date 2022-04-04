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

const mergeFilters = (cohortFilters: GqlOperation, symbol: string, field: string) : ReadonlyArray<GqlOperation> => {
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

const MutationFrequency: React.FC = () => {
  const coreDispatch = useCoreDispatch();
  const [additionalSurvival, setAdditionalSurvival] = useState(undefined);
  const cohortFilters = useCoreSelector((state) => selectCurrentCohortCaseGqlFilters(state));
  const { data: survivalPlotData, isSuccess :survivalPlotReady } = useSurvivalPlot();

  const handleSurvivalPlotToggled = (symbol: string, name: string, field: string) => {
    if (additionalSurvival && additionalSurvival.symbol === symbol) { // remove toggle
      setAdditionalSurvival(undefined);
      coreDispatch(fetchSurvival(undefined));
    } else {
      setAdditionalSurvival({ symbol: symbol, name: name });
      coreDispatch(fetchSurvival({  filters: mergeFilters(cohortFilters, symbol, field) } ));
    }
  };

  const handleTabChanged = () => {
    setAdditionalSurvival(undefined);
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
              onTabChange={ () => {handleTabChanged() }}
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
                    <SurvivalPlot data={survivalPlotData} names={!survivalPlotReady ? [] :  additionalSurvival ? [additionalSurvival.name] : []}/>
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
                  <SurvivalPlot data={survivalPlotData} names={!survivalPlotReady ? [] : additionalSurvival ? [additionalSurvival.name] : []}/>
                </div>
              <MutationsTable handleSurvivalPlotToggled={(symbol: string ,name: string  ) => handleSurvivalPlotToggled(symbol, name, "gene.ssm.ssm_id")} />
            </div>
            </div>
          </Tabs.Tab>
        </Tabs>
    </div>
  );
};

export default MutationFrequency;
