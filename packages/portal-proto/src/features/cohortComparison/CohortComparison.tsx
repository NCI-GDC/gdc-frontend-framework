import { useState } from "react";
import { pickBy } from "lodash";
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
    gender: "demographic.gender",
    ethnicity: "demographic.ethnicity",
    race: "demographic.race",
    vital_status: "demographic.vital_status",
    age_at_diagnosis: "diagnoses.age_at_diagnosis",
  };

  const fieldsToQuery = Object.values(fields).filter((v) => v !== "Survival");

  const { data } = useCohortFacets({
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
      <div className="flex gap-4">
        <div className="p-1 flex basis-2/4 flex-col gap-4">
          {selectedCards.survival && (
            <SurvivalCard
              cohortNames={cohortNames}
              counts={counts}
              setSurvivalPlotSelectable={setSurvivalPlotSelectable}
            />
          )}
          {Object.keys(
            pickBy(selectedCards, (v, k) => v && k !== "survival"),
          ).map((selectedCard) => (
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
          ))}
        </div>
        <div className="p-1 flex basis-2/4">
          <CohortCard
            selectedCards={selectedCards}
            setSelectedCards={setSelectedCards}
            counts={counts}
            cohortNames={cohortNames}
            options={fields}
            survivalPlotSelectable={survivalPlotSelectable}
          />
        </div>
      </div>
    </>
  );
};

export default CohortComparison;
