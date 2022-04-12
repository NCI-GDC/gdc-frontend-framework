import React, { useEffect, useState, useMemo, useRef } from "react";
import { GeneFrequencyChart } from "../charts/GeneFrequencyChart";
import GenesTable from "./GenesTable";
import MutationsTable from "./MutationsTable";
import { Grid, Tabs, LoadingOverlay } from "@mantine/core";
import { EnumFacet } from "../facets/EnumFacet";
import dynamic from "next/dynamic";
import {
  GqlOperation,
  selectCurrentCohortCaseGqlFilters, useCoreDispatch,selectCurrentCohortFilterSet,joinFilters,
  useCoreSelector,
  useSurvivalPlot,
  fetchSurvival,
  createUseFiltersCoreDataHook,
  selectCurrentCohortFilters,
  useSurvivalPlotWithCohortFilters,
  selectGenomicAndCohortFilters,
  selectGenomicGqlFilters,
  selectSurvivalData, selectGenomicFilters,buildCohortGqlOperator
} from "@gff/core";
import isEqual from "lodash/isEqual";


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

const buildGeneHaveAndHaveNotFilters = (currentFilters: GqlOperation, symbol: string, field: string) : ReadonlyArray<GqlOperation> => {
  /**
   * given the contents, add two filters, one with the gene and one without
   */

  if (symbol === undefined)
    return [];

  return ([{
    "op": "and",
    content:
      [ { //TODO: refactor cohortFilters to be Union | Intersection
        "op": "excludeifany",
        "content": {
          "field": field,
          "value": symbol,
        },
      },...(currentFilters ? currentFilters.content as any  : []) ],
  },
    {
      op: "and", content:
        [{
          "op": "=",
          "content": {
            "field": field,
            "value": symbol,
          },
        }, ...(currentFilters ? currentFilters.content as any  : []) ],
    },
  ]);

};

const usePrevious = (value : any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

///const useSurvivalPlotWithCohortAndGenomicFilters = createUseFiltersCoreDataHook(fetchSurvival, selectSurvivalData, selectGenomicAndCohortFilters);

const useSurvivalPlotWithCohortAndGenonmicFilters = () => {
  const coreDispatch = useCoreDispatch();
  const cohortFilters = useCoreSelector((state) => selectCurrentCohortFilters(state));
  const genomicFilters = useCoreSelector((state) => selectGenomicFilters(state));
  const { data, status, error } = useCoreSelector(selectSurvivalData);

  const filters = useMemo(() => buildCohortGqlOperator(joinFilters(cohortFilters, genomicFilters)), [cohortFilters, genomicFilters]);
  const prevFilters = usePrevious(filters);

  useEffect(() => {
    if ((status === "uninitialized") || (!isEqual(prevFilters, filters))) {
      coreDispatch(fetchSurvival(filters ? { filters:[filters] } : undefined )); // eslint-disable-line
    }
  }, [status, coreDispatch, filters]);

  return {
    data,
    error,
    isUninitialized: status === "uninitialized",
    isFetching: status === "pending",
    isSuccess: status === "fulfilled",
    isError: status === "rejected",
  };
}

const GenesAndMutationFrequencyAnalysisTool: React.FC = () => {
  const coreDispatch = useCoreDispatch();
  const [comparativeSurvival, setComparativeSurvival] = useState(undefined);
  const cohortFilters = useCoreSelector((state) => selectCurrentCohortFilterSet(state));
  const genomicFilters = useCoreSelector((state) => selectGenomicFilters(state));
  const { data: survivalPlotData, isSuccess :survivalPlotReady } = useSurvivalPlotWithCohortAndGenonmicFilters();
  const filters = useMemo(() => buildCohortGqlOperator(joinFilters(cohortFilters, genomicFilters)), [cohortFilters, genomicFilters]);
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
      coreDispatch(fetchSurvival(filters ? {  filters: [filters] } : undefined ));
    } else {
      setComparativeSurvival({ symbol: symbol, name: name });
      const f =buildGeneHaveAndHaveNotFilters(filters, symbol, field);
      coreDispatch(fetchSurvival({  filters: f } ));
    }
  };

  useEffect( () => {
    console.log(cohortFilters, " changed")
  }, [ cohortFilters ]);

  /**
   * remove comparative survival plot when tabs or filters change.
   * TODO: Reset table survival button state
   */
  const handleTabOrFilterChanged = () => {
    setComparativeSurvival(undefined);
    coreDispatch(fetchSurvival(filters ? {  filters: [filters] } : undefined ));
  }

  const clearGenomicFilters = () => {
    coreDispatch(clearGenomicFilters)
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
        <Tabs variant="pills" color="pink" classNames = {{
          root: "mt-4 ",
          tabLabel: "text-nci-gray-darkest text-lg",
          tabActive: "bg-nci-teal",
          tabControl: "bg-nci-teal"
        }}
              onTabChange={ () => {handleTabOrFilterChanged() }}
        >
          <Tabs.Tab label="Genes" >
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
