import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Tabs } from "@mantine/core";
import {
  FilterSet,
  selectCurrentCohortFilters,
  joinFilters,
  useCoreSelector,
  buildCohortGqlOperator,
  useTopGene,
  useCoreDispatch,
  removeCohortFilter,
  updateActiveCohortFilter,
  usePrevious,
} from "@gff/core";
import { useAppDispatch, useAppSelector } from "@/features/genomic/appApi";
import { SecondaryTabStyle } from "@/features/cohortBuilder/style";
import {
  selectGeneAndSSMFilters,
  clearGeneAndSSMFilters,
} from "@/features/genomic/geneAndSSMFiltersSlice";
import GeneAndSSMFilterPanel from "@/features/genomic/FilterPanel";
import isEqual from "lodash/isEqual";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { DemoText } from "../shared/tailwindComponents";
import { humanify } from "src/utils";
import { GenesPanel } from "@/features/genomic/GenesPanel";
import { SSMSPanel } from "@/features/genomic/SSMSPanel";

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

const GenesAndMutationFrequencyAnalysisTool: React.FC = () => {
  const isDemoMode = useIsDemoApp();
  const coreDispatch = useCoreDispatch();
  const appDispatch = useAppDispatch();
  const [comparativeSurvival, setComparativeSurvival] =
    useState<Record<string, string>>(undefined);
  const [appMode, setAppMode] = useState<AppModeState>("genes");
  const [searchTermsForGeneId, setSearchTermsForGeneId] = useState({
    geneId: undefined,
    geneSymbol: undefined,
  });
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

  const { data: topGeneSSMS, isSuccess: topGeneSSMSSuccess } = useTopGene({
    cohortFilters: isDemoMode ? overwritingDemoFilter : cohortFilters,
    genomicFilters: genomicFilters,
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
  const handleTabChanged = useCallback(
    (tabKey: string) => {
      setAppMode(tabKey as AppModeState);
      setComparativeSurvival(undefined);
      (searchTermsForGeneId.geneId || searchTermsForGeneId.geneSymbol) &&
        setSearchTermsForGeneId({ geneId: undefined, geneSymbol: undefined });
    },
    [searchTermsForGeneId.geneId, searchTermsForGeneId.geneSymbol],
  );

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
        name:
          appMode === "genes"
            ? topGeneSSMS[0][appMode].name
            : `${topGeneSSMS[0][appMode].name} ${
                topGeneSSMS[0][appMode].aa_change
                  ? topGeneSSMS[0][appMode].aa_change
                  : ""
              } ${humanify({
                term: topGeneSSMS[0][appMode].consequence_type
                  .replace("_variant", "")
                  .replace("_", " "),
              })}`,
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
            root: "bg-base-max border-0 w-full overflow-x-clip",
          }}
          onTabChange={handleTabChanged}
          keepMounted={false}
        >
          <Tabs.List>
            <Tabs.Tab data-testid="button-genes-tab" value="genes">
              Genes
            </Tabs.Tab>
            <Tabs.Tab data-testid="button-mutations-tab" value="ssms">
              Mutations
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="genes" pt="xs">
            <GenesPanel
              topGeneSSMSSuccess={topGeneSSMSSuccess}
              comparativeSurvival={comparativeSurvival}
              handleSurvivalPlotToggled={handleSurvivalPlotToggled}
              handleGeneAndSSmToggled={handleGeneAndSSmToggled}
              handleMutationCountClick={(
                geneId: string,
                geneSymbol: string,
              ) => {
                setSearchTermsForGeneId({ geneId, geneSymbol });
                setAppMode("ssms");
              }}
            />
          </Tabs.Panel>
          <Tabs.Panel value="ssms" pt="xs">
            <SSMSPanel
              topGeneSSMSSuccess={topGeneSSMSSuccess}
              comparativeSurvival={comparativeSurvival}
              handleSurvivalPlotToggled={handleSurvivalPlotToggled}
              handleGeneAndSSmToggled={handleGeneAndSSmToggled}
              searchTermsForGene={searchTermsForGeneId}
            />
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  );
};

export default GenesAndMutationFrequencyAnalysisTool;
