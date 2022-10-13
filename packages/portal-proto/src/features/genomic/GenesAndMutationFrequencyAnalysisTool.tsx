import React, { useEffect, useState, useMemo } from "react";
import { GeneFrequencyChart } from "../charts/GeneFrequencyChart";
// import GenesTable from "../genesTable/GenesTable";
import { GTableContainer } from "../../components/expandableTables/genes/GTableContainer";
import { SMTableContainer } from "../../components/expandableTables/somaticMutations/SMTableContainer";
import { Grid, Tabs, LoadingOverlay } from "@mantine/core";
import EnumFacet from "@/features/facets/EnumFacet";
import ToggleFacet from "@/features/facets/ToggleFacet";
import FilterFacets from "./filters.json";
import dynamic from "next/dynamic";
import {
  GqlOperation,
  useCoreDispatch,
  selectCurrentCohortFilters,
  joinFilters,
  useCoreSelector,
  clearGenomicFilters,
  useGetSurvivalPlotQuery,
  selectGenomicFilters,
  buildCohortGqlOperator,
  useTopGene,
} from "@gff/core";

import { SecondaryTabStyle } from "@/features/cohortBuilder/style";
import { useTotalCounts } from "@/features/facets/hooks";

import {
  useClearGenomicFilters,
  useGenesFacet,
  useUpdateGenomicEnumFacetFilter,
} from "./hooks";

const SurvivalPlot = dynamic(() => import("../charts/SurvivalPlot"), {
  ssr: false,
});

const buildGeneHaveAndHaveNotFilters = (
  currentFilters: GqlOperation,
  symbol: string,
  field: string,
): ReadonlyArray<GqlOperation> => {
  /**
   * given the contents, add two filters, one with the gene and one without
   */

  if (symbol === undefined) return [];

  return [
    {
      op: "and",
      content: [
        {
          //TODO: refactor cohortFilters to be Union | Intersection
          op: "excludeifany",
          content: {
            field: field,
            value: symbol,
          },
        },
        ...(currentFilters ? (currentFilters.content as any) : []),
      ],
    },
    {
      op: "and",
      content: [
        {
          op: "=",
          content: {
            field: field,
            value: symbol,
          },
        },
        ...(currentFilters ? (currentFilters.content as any) : []),
      ],
    },
  ];
};

// Persist which tab is active
type AppModeState = "genes" | "ssms";

const GenesAndMutationFrequencyAnalysisTool: React.FC = () => {
  const coreDispatch = useCoreDispatch();
  const [comparativeSurvival, setComparativeSurvival] = useState(undefined);
  const [appMode, setAppMode] = useState<AppModeState>("genes");
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );

  const genomicFilters = useCoreSelector((state) =>
    selectGenomicFilters(state),
  );

  const filters = useMemo(
    () => buildCohortGqlOperator(joinFilters(cohortFilters, genomicFilters)),

    [cohortFilters, genomicFilters],
  );

  const f = buildGeneHaveAndHaveNotFilters(
    filters,
    comparativeSurvival?.symbol,
    comparativeSurvival?.field,
  );
  const { data: survivalPlotData, isSuccess: survivalPlotReady } =
    useGetSurvivalPlotQuery({
      filters: comparativeSurvival !== undefined ? f : filters ? [filters] : [],
    });

  // pass to Survival Plot when survivalPlotData data is undefined/not ready
  const emptySurvivalPlot = {
    overallStats: { pValue: undefined },
    survivalData: [],
  };

  const { data: topGeneSSMS, isSuccess: topGeneSSMSSuccess } = useTopGene(); // get the default top gene/ssms to show by default
  /**
   * Update survival plot in response to user actions. There are two "states"
   * for the survival plot: If comparativeSurvival is undefined it will show the
   * plot for the currentCohort plus whatever local filters are selected for the "top"
   * gene or mutation.
   * If comparativeSurvival is set, then it will show two separate plots.
   * @param symbol symbol (Gene or SSMS) to compare
   * @param name used as the label for the symbol in the Survival Plot
   * @param field  which gene or ssms field the symbol applied to
   */
  const handleSurvivalPlotToggled = (
    symbol: string,
    name: string,
    field: string,
  ) => {
    if (comparativeSurvival && comparativeSurvival.symbol === symbol) {
      // remove toggle
      setComparativeSurvival(undefined);
    } else {
      setComparativeSurvival({ symbol: symbol, name: name, field: field });
    }
  };

  /**
   * remove comparative survival plot when tabs or filters change.
   */
  const handleTabChanged = (tabKey: string) => {
    setAppMode(tabKey as AppModeState);
    setComparativeSurvival(undefined);
  };

  // clear local filters when cohort changes or tabs change
  useEffect(() => {
    coreDispatch(clearGenomicFilters());
  }, [cohortFilters, coreDispatch]);

  // clear local filters when cohort changes or tabs change
  useEffect(() => {
    coreDispatch(clearGenomicFilters());
  }, [cohortFilters, coreDispatch]);

  /**
   * Clear comparative when local filters change
   */
  useEffect(() => {
    setComparativeSurvival(undefined);
  }, [filters]);

  /**
   *  Received a new topGene in response to a filter change, so set comparativeSurvival
   *  which will update the survival plot
   */
  useEffect(() => {
    if (topGeneSSMSSuccess && comparativeSurvival === undefined) {
      setComparativeSurvival({
        symbol: topGeneSSMS[0][appMode].symbol,
        name: topGeneSSMS[0][appMode].name,
        field: appMode === "genes" ? "gene.symbol" : "gene.ssm.ssm_id",
      });
    }
  }, [appMode, comparativeSurvival, topGeneSSMS, topGeneSSMSSuccess]);

  return (
    <div className="flex flex-row">
      <div className="flex flex-col gap-y-4 mr-3 mt-12 w-min-64 w-max-64">
        {FilterFacets.genes.map((x, index) => {
          if (x.type == "toggle") {
            return (
              <ToggleFacet
                key={`${x.facet_filter}-${index}`}
                field={`${x.facet_filter}`}
                hooks={{
                  useGetFacetData: useGenesFacet,
                  useUpdateFacetFilters: useUpdateGenomicEnumFacetFilter,
                  useClearFilter: useClearGenomicFilters,
                  useTotalCounts: useTotalCounts,
                }}
                facetName={x.name}
                docType="genes"
                showPercent={false}
                hideIfEmpty={false}
                description={x.description}
                width="w-64"
              />
            );
          }
          return (
            <EnumFacet
              key={`genes-mutations-app-${x.facet_filter}-${index}`}
              field={`${x.facet_filter}`}
              hooks={{
                useGetFacetData: useGenesFacet,
                useUpdateFacetFilters: useUpdateGenomicEnumFacetFilter,
                useClearFilter: useClearGenomicFilters,
                useTotalCounts: useTotalCounts,
              }}
              facetName={x.name}
              docType="genes"
              showPercent={false}
              hideIfEmpty={false}
              description={x.description}
              width="w-64"
            />
          );
        })}
        {FilterFacets.ssms.map((x, index) => {
          return (
            <EnumFacet
              key={`genes-mutations-app-${x.facet_filter}-${index}`}
              field={`${x.facet_filter}`}
              facetName={x.name}
              docType="ssms"
              hooks={{
                useGetFacetData: useGenesFacet,
                useUpdateFacetFilters: useUpdateGenomicEnumFacetFilter,
                useClearFilter: useClearGenomicFilters,
                useTotalCounts: useTotalCounts,
              }}
              showPercent={false}
              hideIfEmpty={false}
              width="w-64"
            />
          );
        })}
      </div>
      <Tabs
        value={appMode}
        defaultValue="genes"
        classNames={{
          tab: SecondaryTabStyle,
          tabsList: "px-2 mt-2 border-0",
          root: "bg-base-max border-0",
        }}
        onTabChange={handleTabChanged}
      >
        <Tabs.List>
          <Tabs.Tab value="genes">Genes</Tabs.Tab>
          <Tabs.Tab value="ssms">Mutations</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="genes" pt="xs">
          <div className="flex flex-row mt-3">
            <div className="flex flex-col w-screen">
              <Grid className="mx-2  bg-base-max w-9/12">
                <Grid.Col span={6}>
                  <GeneFrequencyChart marginBottom={95} />
                </Grid.Col>
                <Grid.Col span={6} className="relative">
                  <LoadingOverlay
                    visible={!survivalPlotReady && !topGeneSSMSSuccess}
                  />
                  <SurvivalPlot
                    data={
                      survivalPlotReady &&
                      survivalPlotData.survivalData.length > 1
                        ? survivalPlotData
                        : emptySurvivalPlot
                    }
                    names={
                      survivalPlotReady && comparativeSurvival
                        ? [comparativeSurvival.symbol]
                        : []
                    }
                  />
                </Grid.Col>
              </Grid>
              {/* <GenesTable
                selectedSurvivalPlot={comparativeSurvival}
                handleSurvivalPlotToggled={(symbol: string, name: string) =>
                  handleSurvivalPlotToggled(symbol, name, "gene.symbol")
                }
              /> */}
            </div>
          </div>
          <div className={`flex flex-col w-screen`}>
            <GTableContainer
              selectedSurvivalPlot={comparativeSurvival}
              handleSurvivalPlotToggled={(symbol: string, name: string) =>
                handleSurvivalPlotToggled(symbol, name, "gene.symbol")
              }
            />
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="ssms" pt="xs">
          <div className="flex flex-row">
            <div className="flex flex-col">
              <div className="bg-base-lightest w-9/12">
                <LoadingOverlay
                  visible={!survivalPlotReady && !topGeneSSMSSuccess}
                />
                <SurvivalPlot
                  data={
                    survivalPlotReady &&
                    comparativeSurvival &&
                    survivalPlotData.survivalData.length > 1
                      ? survivalPlotData
                      : emptySurvivalPlot
                  }
                  names={
                    survivalPlotReady && comparativeSurvival
                      ? [comparativeSurvival.name]
                      : []
                  }
                />
              </div>
              {/* <MutationsTable
                selectedSurvivalPlot={comparativeSurvival}
                handleSurvivalPlotToggled={(symbol: string, name: string) =>
                  handleSurvivalPlotToggled(symbol, name, "gene.ssm.ssm_id")
                }
              /> */}
            </div>
          </div>
          <div className={`flex flex-col w-screen`}>
            <SMTableContainer
              selectedSurvivalPlot={comparativeSurvival}
              handleSurvivalPlotToggled={(symbol: string, name: string) =>
                handleSurvivalPlotToggled(symbol, name, "gene.ssm.ssm_id")
              }
            />
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default GenesAndMutationFrequencyAnalysisTool;
