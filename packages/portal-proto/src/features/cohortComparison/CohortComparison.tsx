import { useState } from "react";
import { pickBy } from "lodash";
import {
  useCohortCases,
  useCoreSelector,
  selectCurrentCohort,
} from "@gff/core";
import CohortCard from "./CohortCard";
import SurvivalCard from "./SurvivalCard";
import FacetCard from "./FacetCard";

const COMPARISON_COHORT = "Baily's Cohort";

const CohortComparison: React.FC = () => {
  const [selectedCards, setSelectedCards] = useState({
    survival: true,
    ethnicity: false,
    gender: true,
    race: false,
    vital_status: true,
    age_at_diagnosis: true,
  } as Record<string, boolean>);

  const fields = {
    gender: "demographic.gender",
    ethnicity: "demographic.ethnicity",
    race: "demographic.race",
    vital_status: "demographic.vital_status",
    age_at_diagnosis: "diagnoses.age_at_diagnosis",
  };

  const fieldsToQuery = Object.values(fields);
  const { data } = useCohortCases(fieldsToQuery);
  const primaryCohortName = useCoreSelector((state) =>
    selectCurrentCohort(state),
  );
  const cohortNames = [primaryCohortName, COMPARISON_COHORT];

  return (
    <>
      <h1 className="text-xl font-semibold">Cohort Comparison</h1>
      <div className="flex gap-4">
        <div className="p-1 flex basis-2/4 flex-col gap-4">
          {selectedCards.survival && <SurvivalCard />}
          {Object.keys(
            pickBy(selectedCards, (v, k) => v && k !== "survival"),
          ).map((selectedCard) => (
            <FacetCard
              key={selectedCard}
              data={data.aggregations.map((d) => d[fields[selectedCard]])}
              field={fields[selectedCard]}
              counts={data?.caseCounts}
              cohortNames={cohortNames}
            />
          ))}
        </div>
        <div className="p-1 flex basis-2/4">
          <CohortCard
            selectedCards={selectedCards}
            setSelectedCards={setSelectedCards}
            counts={data?.caseCounts}
            cohortNames={cohortNames}
            options={fields}
          />
        </div>
      </div>
    </>
  );
};

export default CohortComparison;
