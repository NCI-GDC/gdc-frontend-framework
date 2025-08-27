import { useState } from "react";
import { pickBy } from "lodash";
import { LoadingOverlay } from "@mantine/core";
import {
  FilterSet,
  buildCohortGqlOperator,
  useCohortFacetsQuery,
  useCreateCaseSetFromFiltersMutation,
} from "@gff/core";
import CohortCard from "./CohortCard/CohortCard";
import SurvivalCard from "./SurvivalCard";
import FacetCard from "./FacetCard";
import { DemoText } from "@/components/tailwindComponents";
import { useDeepCompareEffect } from "use-deep-compare";

export interface CohortComparisonType {
  primary_cohort: {
    filter: FilterSet;
    name: string;
    id: string;
  };
  comparison_cohort: {
    filter: FilterSet;
    name: string;
    id: string;
  };
}

interface CohortComparisonProps {
  readonly cohorts: CohortComparisonType;
  readonly demoMode: boolean;
}

const fields = {
  survival: "Survival",
  ethnicity: "demographic.ethnicity",
  gender: "demographic.gender",
  race: "demographic.race",
  vital_status: "demographic.vital_status",
  age_at_diagnosis: "diagnoses.age_at_diagnosis",
};

const CohortComparison: React.FC<CohortComparisonProps> = ({
  cohorts,
  demoMode = false,
}: CohortComparisonProps) => {
  const [selectedCards, setSelectedCards] = useState({
    survival: true,
    ethnicity: false,
    gender: true,
    race: false,
    vital_status: true,
    age_at_diagnosis: true,
  } as Record<string, boolean>);

  const [survivalPlotSelectable, setSurvivalPlotSelectable] = useState(true);
  const fieldsToQuery = Object.values(fields).filter((v) => v !== "Survival");

  const [createPrimaryCaseSet, primarySetResponse] =
    useCreateCaseSetFromFiltersMutation();
  const [createComparisonCaseSet, comparisonSetResponse] =
    useCreateCaseSetFromFiltersMutation();

  const {
    data: cohortFacetsData,
    isFetching: cohortFacetsFetching,
    isLoading: cohortFacetsLoading,
    isUninitialized: cohortFacetsUninitialized,
  } = useCohortFacetsQuery(
    {
      facetFields: fieldsToQuery,
      primaryCohortSetId: primarySetResponse.data,
      comparisonCohortSetId: comparisonSetResponse.data,
    },
    {
      skip:
        primarySetResponse.data === undefined ||
        comparisonSetResponse.data === undefined,
    },
  );

  const counts = cohortFacetsData?.caseCounts || [];

  useDeepCompareEffect(() => {
    createPrimaryCaseSet({
      filters: buildCohortGqlOperator(cohorts.primary_cohort.filter) ?? {},
      intent: "portal",
      set_type: "ephemeral",
    });
    createComparisonCaseSet({
      filters: buildCohortGqlOperator(cohorts.comparison_cohort.filter) ?? {},
      intent: "portal",
      set_type: "ephemeral",
    });
  }, [
    cohorts.primary_cohort.filter,
    cohorts.comparison_cohort.filter,
    createComparisonCaseSet,
    createPrimaryCaseSet,
  ]);

  const isSetsloading =
    primarySetResponse.isUninitialized ||
    primarySetResponse.isLoading ||
    comparisonSetResponse.isUninitialized ||
    comparisonSetResponse.isLoading;

  const caseSetIds =
    primarySetResponse.isSuccess && comparisonSetResponse.isSuccess
      ? [primarySetResponse.data, comparisonSetResponse.data]
      : [];

  return (
    <div className="mt-6 px-4 mb-16">
      {demoMode && (
        <DemoText>
          Demo showing cases with low grade gliomas with and without mutations
          in the genes IDH1 and IDH2.
        </DemoText>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="flex flex-col gap-y-4 lg:col-span-3 order-2 lg:order-1">
          {selectedCards.survival && (
            <div className="border-1 border-base-lighter">
              <SurvivalCard
                cohorts={cohorts}
                counts={counts}
                caseSetIds={caseSetIds}
                setSurvivalPlotSelectable={setSurvivalPlotSelectable}
                isSetsloading={isSetsloading}
              />
            </div>
          )}
          {Object.keys(
            pickBy(selectedCards, (v, k) => v && k !== "survival"),
          ).map((selectedCard) => (
            <div
              className="relative border-1 border-base-lighter"
              key={selectedCard}
            >
              <LoadingOverlay
                data-testid="loading-spinner"
                visible={
                  cohortFacetsFetching ||
                  cohortFacetsUninitialized ||
                  cohortFacetsLoading
                }
                zIndex={1} // need z-index 1
              />
              <FacetCard
                data={
                  cohortFacetsData?.aggregations
                    ? cohortFacetsData.aggregations.map(
                        (d) => d[fields[selectedCard]],
                      )
                    : []
                }
                field={fields[selectedCard]}
                counts={counts}
                cohorts={cohorts}
              />
            </div>
          ))}
        </div>
        <div className="lg:col-span-2 order-1 lg:order-2">
          <CohortCard
            selectedCards={selectedCards}
            setSelectedCards={setSelectedCards}
            counts={counts}
            cohorts={cohorts}
            options={fields}
            survivalPlotSelectable={survivalPlotSelectable}
            caseSetIds={caseSetIds}
            casesFetching={cohortFacetsFetching}
          />
        </div>
      </div>
    </div>
  );
};

export default CohortComparison;
