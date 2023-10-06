import { useEffect, useState } from "react";
import { pickBy } from "lodash";
import { LoadingOverlay } from "@mantine/core";
import {
  FilterSet,
  buildCohortGqlOperator,
  useCohortFacetsQuery,
  useCreateCaseSetFromFiltersMutation,
} from "@gff/core";
import CohortCard from "./CohortCard";
import SurvivalCard from "./SurvivalCard";
import FacetCard from "./FacetCard";
import { DemoText } from "@/components/tailwindComponents";

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

  const fields = {
    survival: "Survival",
    ethnicity: "demographic.ethnicity",
    gender: "demographic.gender",
    race: "demographic.race",
    vital_status: "demographic.vital_status",
    age_at_diagnosis: "diagnoses.age_at_diagnosis",
  };

  const fieldsToQuery = Object.values(fields).filter((v) => v !== "Survival");

  const [createPrimaryCaseSet, primarySetResponse] =
    useCreateCaseSetFromFiltersMutation();
  const [createComparisonCaseSet, comparisonSetResponse] =
    useCreateCaseSetFromFiltersMutation();

  const { data, isFetching, isUninitialized } = useCohortFacetsQuery(
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

  const counts = data?.caseCounts || [];

  useEffect(() => {
    createPrimaryCaseSet({
      filters: buildCohortGqlOperator(cohorts.primary_cohort.filter) ?? {},
    });
    createComparisonCaseSet({
      filters: buildCohortGqlOperator(cohorts.comparison_cohort.filter) ?? {},
    });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loading =
    isFetching ||
    isUninitialized ||
    primarySetResponse.isUninitialized ||
    primarySetResponse.isLoading ||
    comparisonSetResponse.isUninitialized ||
    comparisonSetResponse.isLoading;
  const caseSetIds =
    primarySetResponse.isSuccess && comparisonSetResponse.isSuccess
      ? [primarySetResponse.data, comparisonSetResponse.data]
      : [];

  return (
    <>
      {demoMode && (
        <DemoText>
          Demo showing cases with low grade gliomas with and without mutations
          in the genes IDH1 and IDH2.
        </DemoText>
      )}
      <div className="flex gap-4 pt-2">
        <div className="p-1 flex basis-7/12 flex-col gap-4">
          {loading ? (
            <div className="min-w-[600px] min-h-[400px] relative">
              <LoadingOverlay
                vdata-testid="loading-spinner"
                visible={isFetching}
                zIndex={0}
              />
            </div>
          ) : (
            selectedCards.survival && (
              <SurvivalCard
                cohorts={cohorts}
                counts={counts}
                caseSetIds={caseSetIds}
                setSurvivalPlotSelectable={setSurvivalPlotSelectable}
              />
            )
          )}
          {Object.keys(
            pickBy(selectedCards, (v, k) => v && k !== "survival"),
          ).map((selectedCard) =>
            isFetching ? (
              <div
                className="min-w-[600px] min-h-[400px] relative"
                key={selectedCard}
              >
                <LoadingOverlay
                  data-testid="loading-spinner"
                  visible={isFetching}
                />
              </div>
            ) : (
              <FacetCard
                key={selectedCard}
                data={
                  data?.aggregations
                    ? data.aggregations.map((d) => d[fields[selectedCard]])
                    : []
                }
                field={fields[selectedCard]}
                counts={counts}
                cohorts={cohorts}
              />
            ),
          )}
        </div>
        <div className="p-1 flex basis-1/4">
          <CohortCard
            selectedCards={selectedCards}
            setSelectedCards={setSelectedCards}
            counts={counts}
            cohorts={cohorts}
            options={fields}
            survivalPlotSelectable={survivalPlotSelectable}
            caseSetIds={caseSetIds}
            casesFetching={isFetching}
          />
        </div>
      </div>
    </>
  );
};

export default CohortComparison;
