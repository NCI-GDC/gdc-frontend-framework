import { useState } from "react";
import { pickBy } from "lodash";
import { LoadingOverlay } from "@mantine/core";
import { useCohortFacets } from "@gff/core";
import CohortCard from "./CohortCard";
import SurvivalCard from "./SurvivalCard";
import FacetCard from "./FacetCard";

interface CohortComparisonProps {
  readonly cohortNames: string[];
  readonly demoMode?: boolean;
}

const CohortComparison: React.FC<CohortComparisonProps> = ({
  cohortNames,
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

  const { data, isFetching, isUninitialized } = useCohortFacets({
    facetFields: fieldsToQuery,
    primaryCohort: cohortNames[0],
    comparisonCohort: cohortNames[1],
  });
  const counts = data?.caseCounts || [];

  return (
    <>
      {demoMode && (
        <span className="italic px-2 py-1">
          {
            "Demo showing cases with pancreatic cancer with and without mutations in the gene KRAS."
          }
        </span>
      )}
      <div className="flex gap-4 pt-2 bg-base-lightest">
        <div className="p-1 flex basis-7/12 flex-col gap-4">
          {isFetching || isUninitialized ? (
            <div className="min-w-[600px] min-h-[400px] relative">
              <LoadingOverlay visible={isFetching} />
            </div>
          ) : (
            selectedCards.survival && (
              <SurvivalCard
                cohortNames={cohortNames}
                counts={counts}
                caseIds={data?.caseIds}
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
                <LoadingOverlay visible={isFetching} />
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
                cohortNames={cohortNames}
              />
            ),
          )}
        </div>
        <div className="p-1 flex basis-1/4">
          <CohortCard
            selectedCards={selectedCards}
            setSelectedCards={setSelectedCards}
            counts={counts}
            cohortNames={cohortNames}
            options={fields}
            survivalPlotSelectable={survivalPlotSelectable}
            caseIds={data?.caseIds}
            casesFetching={isFetching}
          />
        </div>
      </div>
    </>
  );
};

export default CohortComparison;
