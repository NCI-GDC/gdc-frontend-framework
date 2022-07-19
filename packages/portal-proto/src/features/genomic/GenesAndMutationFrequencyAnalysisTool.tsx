import React, { useEffect, useState, useMemo } from "react";
import { GeneFrequencyChart } from "../charts/GeneFrequencyChart";
import GenesTable from "../genesTable/GenesTable";
import MutationsTable from "../mutationsTable/MutationsTable";
import { Grid, Tabs, LoadingOverlay } from "@mantine/core";
import isEqual from "lodash/isEqual";
import { EnumFacet } from "../facets/EnumFacet";
import dynamic from "next/dynamic";
import {
  GqlOperation,
  useCoreDispatch,
  selectCurrentCohortFilterSet,
  joinFilters,
  useCoreSelector,
  clearGenomicFilters,
  fetchSurvival,
  useSurvivalPlot,
  selectGenomicFilters,
  buildCohortGqlOperator,
  useTopGene,
  usePrevious,
} from "@gff/core";

const SurvivalPlot = dynamic(() => import("../charts/SurvivalPlot"), {
  ssr: false,
});

const GenesFacetNames = [
  {
    facet_filter: "genes.biotype",
    name: "Biotype",
    description: "No description",
  },
  {
    facet_filter: "genes.is_cancer_gene_census",
    name: "Is Cancer Gene Census",
    description: "No description",
  },
];

const MutationFacetNames = [
  {
    facet_filter: "ssms.consequence.transcript.annotation.vep_impact",
    name: "VEP Impact",
    description: "No description",
  },
  {
    facet_filter: "ssms.consequence.transcript.annotation.sift_impact",
    name: "SIFT Impact",
    description: "No description",
  },
  {
    facet_filter: "ssms.consequence.transcript.annotation.polyphen_impact",
    name: "Polyphen Impact",
    description: "No description",
  },
  {
    facet_filter: "ssms.consequence.transcript.consequence_type",
    name: "Consequence Type",
    description: "No description",
  },
  {
    facet_filter: "ssms.mutation_subtype",
    name: "Type",
    description: "No description",
  },
];

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
    selectCurrentCohortFilterSet(state),
  );
  const genomicFilters = useCoreSelector((state) =>
    selectGenomicFilters(state),
  );

  const filters = useMemo(
    () => buildCohortGqlOperator(joinFilters(cohortFilters, genomicFilters)),
    [cohortFilters, genomicFilters],
  );
  const { data: survivalPlotData, isSuccess: survivalPlotReady } =
    useSurvivalPlot({ filters: filters ? [filters] : [] });

  const prevComparative = usePrevious(comparativeSurvival);

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
  const handleTabChanged = (_tabIndex: number, tabKey?: string) => {
    setAppMode(tabKey as AppModeState);
    setComparativeSurvival(undefined);
  };

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

  useEffect(() => {
    if (comparativeSurvival && !isEqual(comparativeSurvival, prevComparative)) {
      const f = buildGeneHaveAndHaveNotFilters(
        filters,
        comparativeSurvival.symbol,
        comparativeSurvival.field,
      );
      coreDispatch(fetchSurvival({ filters: f }));
    }
  }, [
    cohortFilters,
    prevComparative,
    comparativeSurvival,
    coreDispatch,
    filters,
  ]);

  return (
    <div className="flex flex-row">
      <div className="flex flex-col gap-y-4 mr-3 mt-12 w-min-64 w-max-64">
        {GenesFacetNames.map((x, index) => {
          return (
            <EnumFacet
              key={`${x.facet_filter}-${index}`}
              field={`${x.facet_filter}`}
              facetName={x.name}
              docType="genes"
              showPercent={false}
              hideIfEmpty={false}
              description={x.description}
            />
          );
        })}
        {MutationFacetNames.map((x, index) => {
          return (
            <EnumFacet
              key={`${x.facet_filter}-${index}`}
              field={`${x.facet_filter}`}
              facetName={x.name}
              docType="ssms"
              showPercent={false}
              hideIfEmpty={false}
              description={x.description}
            />
          );
        })}
      </div>
      <Tabs
        variant="pills"
        classNames={{
          root: "mt-6",
          tabActive:
            "bg-nci-blue-darkest text-nci-gray-lightest font-medium p-4 hover:bg-nci-blue-dark",
        }}
        onTabChange={handleTabChanged}
      >
        <Tabs.Tab label="Genes" tabKey="genes">
          <div className="flex flex-row">
            <div className="flex flex-col">
              <Grid className="mx-2 bg-white w-9/12">
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
              <GenesTable
                selectedSurvivalPlot={comparativeSurvival}
                handleSurvivalPlotToggled={(symbol: string, name: string) =>
                  handleSurvivalPlotToggled(symbol, name, "gene.symbol")
                }
              />
            </div>
          </div>
        </Tabs.Tab>
        <Tabs.Tab label="Mutations" tabKey="ssms">
          <div className="flex flex-row">
            <div className="flex flex-col">
              <div className="bg-white w-9/12">
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
              <MutationsTable
                selectedSurvivalPlot={comparativeSurvival}
                handleSurvivalPlotToggled={(symbol: string, name: string) =>
                  handleSurvivalPlotToggled(symbol, name, "gene.ssm.ssm_id")
                }
              />
            </div>
          </div>
        </Tabs.Tab>
      </Tabs>
    </div>
  );
};

export default GenesAndMutationFrequencyAnalysisTool;
