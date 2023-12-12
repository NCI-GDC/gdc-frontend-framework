import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useDeepCompareCallback } from "use-deep-compare";
import { Tabs } from "@mantine/core";
import {
  FilterSet,
  selectCurrentCohortGeneAndSSMCaseSet,
  useCoreSelector,
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
import { DemoText } from "@/components/tailwindComponents";
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
    selectCurrentCohortGeneAndSSMCaseSet(state),
  );

  const genomicFilters: FilterSet = useAppSelector((state) =>
    selectGeneAndSSMFilters(state),
  );

  const overwritingDemoFilter = useMemo(
    () => overwritingDemoFilterMutationFrequency,
    [],
  );

  const { data: topGeneSSMS, isSuccess: topGeneSSMSSuccess } = useTopGene({
    cohortFilters: isDemoMode ? overwritingDemoFilter : cohortFilters,
    genomicFilters: genomicFilters,
  }); // get the default top gene/ssms to show by default
  const prevTopGeneSSMS = usePrevious(topGeneSSMS);
  const prevAppMode = usePrevious(appMode);

  useEffect(() => {
    if (
      topGeneSSMS.length &&
      (!isEqual(topGeneSSMS, prevTopGeneSSMS) || !isEqual(appMode, prevAppMode))
    ) {
      const { genes, ssms } = topGeneSSMS[0];
      const { name, symbol } = appMode === "genes" ? genes : ssms;
      const { consequence_type, aa_change } = ssms;
      handleSurvivalPlotToggled(
        symbol,
        appMode === "genes"
          ? name
          : `${name} ${aa_change ?? ""} ${
              consequence_type
                ? humanify({
                    term: consequence_type
                      .replace("_variant", "")
                      .replace("_", " "),
                  })
                : ""
            }`,
        appMode === "genes" ? "gene.symbol" : "gene.ssm.ssm_id",
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topGeneSSMS, appMode]);
  /**
   * Update survival plot in response to user actions. There are two "states"
   * for the survival plot: If comparativeSurvival is undefined it will show the
   * plot for the currentCohort plus whatever local filters are selected for the "top"
   * gene or mutation.
   * If comparativeSurvival is set, then it will show two separate plots.
   * @param symbol - symbol (Gene or SSMS) to compare
   * @param name - used as the label for the symbol in the Survival Plot
   * @param field - which gene or ssms field the symbol applied to
   */
  const handleSurvivalPlotToggled = useDeepCompareCallback(
    (symbol: string, name: string, field: string) => {
      if (comparativeSurvival && comparativeSurvival.symbol === symbol) {
        // remove toggle and plot topmost
        const { genes, ssms } = topGeneSSMS[0];
        const { name, symbol } = appMode === "genes" ? genes : ssms;
        const { consequence_type, aa_change } = ssms;
        setComparativeSurvival({
          symbol: symbol,
          name:
            appMode === "genes"
              ? name
              : `${name} ${aa_change ?? ""} ${
                  consequence_type
                    ? humanify({
                        term: consequence_type
                          .replace("_variant", "")
                          .replace("_", " "),
                      })
                    : ""
                }`,
          field: appMode === "genes" ? "gene.symbol" : "gene.ssm.ssm_id",
        });
      } else {
        setComparativeSurvival({ symbol: symbol, name: name, field: field });
      }
    },
    [comparativeSurvival, appMode, topGeneSSMS],
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

  const handleMutationCountClick = useCallback(
    (geneId: string, geneSymbol: string) => {
      setAppMode("ssms");
      setSearchTermsForGeneId({ geneId: geneId, geneSymbol: geneSymbol });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // clear local filters when cohort changes or tabs change
  useEffect(() => {
    appDispatch(clearGeneAndSSMFilters());
  }, [overwritingDemoFilter, cohortFilters, appDispatch]);

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
              handleMutationCountClick={handleMutationCountClick}
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
