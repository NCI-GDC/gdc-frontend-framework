import React, { useCallback, useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import partial from "lodash/partial";
import { Grid, Tabs, LoadingOverlay } from "@mantine/core";
import {
  FilterSet,
  GqlOperation,
  selectCurrentCohortFilters,
  joinFilters,
  useCoreSelector,
  useGetSurvivalPlotQuery,
  buildCohortGqlOperator,
  useTopGene,
  useCoreDispatch,
  removeCohortFilter,
  updateActiveCohortFilter,
  usePrevious,
} from "@gff/core";
import { GeneFrequencyChart } from "../charts/GeneFrequencyChart";
import { GTableContainer } from "@/components/expandableTables/genes/GTableContainer";
import { SMTableContainer } from "@/components/expandableTables/somaticMutations/SMTableContainer";
import { useAppDispatch, useAppSelector } from "@/features/genomic/appApi";
import { SecondaryTabStyle } from "@/features/cohortBuilder/style";
import { useSelectFilterContent } from "./hooks";
import {
  selectGeneAndSSMFilters,
  clearGeneAndSSMFilters,
} from "@/features/genomic/geneAndSSMFiltersSlice";
import { SurvivalPlotTypes } from "@/features/charts/SurvivalPlot";
import GeneAndSSMFilterPanel from "@/features/genomic/FilterPanel";
import isEqual from "lodash/isEqual";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { DemoText } from "../shared/tailwindComponents";

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

export const overwritingDemoFilterMutationFrequency: FilterSet = {
  mode: "and",
  root: {
    "cases.project.project_id": {
      operator: "includes",
      field: "cases.project.project_id",
      operands: ["TCGA-LGG"],
    },
  },
};

// need to define isDemoMode Here
const GenesAndMutationFrequencyAnalysisTool: React.FC = () => {
  const isDemoMode = useIsDemoApp();
  const coreDispatch = useCoreDispatch();
  const appDispatch = useAppDispatch();
  const [comparativeSurvival, setComparativeSurvival] = useState(undefined);
  const [appMode, setAppMode] = useState<AppModeState>("genes");
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );

  const genomicFilters: FilterSet = useAppSelector((state) =>
    selectGeneAndSSMFilters(state),
  );

  const overwritingDemoFilter = useMemo(
    () => overwritingDemoFilterMutationFrequency,
    [],
  );

  /**
   * Get genes in cohort
   */
  const currentGenes = useSelectFilterContent("genes.gene_id");
  const currentMutations = useSelectFilterContent("ssms.ssm_id");

  const filters = useMemo(
    () =>
      buildCohortGqlOperator(
        joinFilters(
          isDemoMode ? overwritingDemoFilter : cohortFilters,
          genomicFilters,
        ),
      ),

    [isDemoMode, cohortFilters, overwritingDemoFilter, genomicFilters],
  );

  const prevFilters = usePrevious(filters);

  const f = useMemo(
    () =>
      buildGeneHaveAndHaveNotFilters(
        filters,
        comparativeSurvival?.symbol,
        comparativeSurvival?.field,
      ),
    [comparativeSurvival?.field, comparativeSurvival?.symbol, filters],
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

  const { data: topGeneSSMS, isSuccess: topGeneSSMSSuccess } = useTopGene({
    genomicFilters,
    isDemoMode,
    overwritingDemoFilter,
  }); // get the default top gene/ssms to show by default

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
  const handleSurvivalPlotToggled = useCallback(
    (symbol: string, name: string, field: string) => {
      if (comparativeSurvival && comparativeSurvival.symbol === symbol) {
        // remove toggle
        setComparativeSurvival(undefined);
      } else {
        setComparativeSurvival({ symbol: symbol, name: name, field: field });
      }
    },
    [comparativeSurvival],
  );

  const handleGeneAndSSmToggled = useCallback(
    (
      cohortStatus: string[],
      field: string,
      idField: string,
      payload: Record<string, any>,
    ) => {
      if (cohortStatus.includes(payload[idField])) {
        // remove the id from the cohort
        const update = cohortStatus.filter((x) => x != payload[idField]);
        if (update.length > 0)
          coreDispatch(
            updateActiveCohortFilter({
              field: field,
              operation: {
                field: field,
                operator: "includes",
                operands: update,
              },
            }),
          );
        else coreDispatch(removeCohortFilter(field));
      } else
        coreDispatch(
          updateActiveCohortFilter({
            field: field,
            operation: {
              field: field,
              operator: "includes",
              operands: [...cohortStatus, payload[idField]],
            },
          }),
        );
    },
    [coreDispatch],
  );

  /**
   * remove comparative survival plot when tabs or filters change.
   */
  const handleTabChanged = useCallback((tabKey: string) => {
    setAppMode(tabKey as AppModeState);
    setComparativeSurvival(undefined);
  }, []);

  // clear local filters when cohort changes or tabs change
  useEffect(() => {
    appDispatch(clearGeneAndSSMFilters());
  }, [overwritingDemoFilter, cohortFilters, appDispatch]);

  /**
   * Clear comparative when local filters change
   */
  useEffect(() => {
    if (!isEqual(prevFilters, filters)) setComparativeSurvival(undefined);
  }, [filters, prevFilters]);

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
    <>
      <>
        {isDemoMode && (
          <DemoText>
            Demo showing cases with low grade gliomas (TCGA-LGG project).
          </DemoText>
        )}
      </>
      <div className="flex flex-row w-100">
        <GeneAndSSMFilterPanel isDemoMode={isDemoMode} />
        <Tabs
          value={appMode}
          defaultValue="genes"
          classNames={{
            tab: SecondaryTabStyle,
            tabsList: "px-2 mt-2 border-0",
            root: "bg-base-max border-0 w-full",
          }}
          onTabChange={handleTabChanged}
          keepMounted={false}
        >
          <Tabs.List>
            <Tabs.Tab value="genes">Genes</Tabs.Tab>
            <Tabs.Tab value="ssms">Mutations</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="genes" pt="xs">
            <div className="flex flex-col w-100 mx-6">
              <Grid className="mx-2 bg-base-max">
                <Grid.Col span={6}>
                  <GeneFrequencyChart
                    marginBottom={95}
                    genomicFilters={genomicFilters}
                    isDemoMode={isDemoMode}
                    overwritingDemoFilter={overwritingDemoFilter}
                  />
                </Grid.Col>
                <Grid.Col span={6} className="relative">
                  <LoadingOverlay
                    visible={!survivalPlotReady && !topGeneSSMSSuccess}
                  />
                  <SurvivalPlot
                    plotType={SurvivalPlotTypes.mutation}
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
              <GTableContainer
                selectedSurvivalPlot={comparativeSurvival}
                handleSurvivalPlotToggled={handleSurvivalPlotToggled}
                handleGeneToggled={partial(
                  handleGeneAndSSmToggled,
                  currentGenes,
                  "genes.gene_id",
                  "geneID",
                )}
                toggledGenes={currentGenes}
                genomicFilters={genomicFilters}
                cohortFilters={
                  isDemoMode ? overwritingDemoFilter : cohortFilters
                }
                isDemoMode={isDemoMode}
              />
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="ssms" pt="xs">
            <div className="flex flex-col w-100 mx-6 mb-8">
              <div className="bg-base-max">
                <LoadingOverlay
                  visible={!survivalPlotReady && !topGeneSSMSSuccess}
                />
                <SurvivalPlot
                  plotType={SurvivalPlotTypes.mutation}
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
            </div>
            <SMTableContainer
              selectedSurvivalPlot={comparativeSurvival}
              handleSurvivalPlotToggled={handleSurvivalPlotToggled}
              genomicFilters={genomicFilters}
              cohortFilters={isDemoMode ? overwritingDemoFilter : cohortFilters}
              handleSsmToggled={partial(
                handleGeneAndSSmToggled,
                currentMutations,
                "ssms.ssm_id",
                "mutationID",
              )}
              toggledSsms={currentMutations}
              isDemoMode={isDemoMode}
              isModal={true}
            />
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  );
};

export default GenesAndMutationFrequencyAnalysisTool;
