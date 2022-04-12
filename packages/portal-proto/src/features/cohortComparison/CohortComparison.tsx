import { useState } from "react";
import { pickBy } from "lodash";
import { useCohortCases, selectAvailableCohorts, useCoreSelector } from "@gff/core";
import CohortCard from "./CohortCard";
import SurvivalCard from "./SurvivalCard";
import FacetCard from "./FacetCard";

const CohortComparison = () => {
  const [selectedCards, setSelectedCards] = useState({
    survival: true,
    ethnicity: false,
    gender: true,
    race: false,
    vital_status: true,
    age_at_diagnosis: true,
  });
  const fields = {
    gender: "demographic.gender",
    ethnicity: "demographic.ethnicity",
    race: "demographic.race",
    vital_status: "demographic.vital_status",
    age_at_diagnosis: "diagnoses.age_at_diagnosis",
  };

  const labels = {
    survival: "Survival",
    ethnicity: "Ethnicity",
    gender: "Gender",
    race: "Race",
    vital_status: "Vital Status",
    age_at_diagnosis: "Age At Diagnosis",
  };

  // TODO fix 
  const fieldsToQuery = Object.values(
    pickBy(fields, (_, k) => Object.keys(selectedCards).includes(k)),
  );
  const { data } = useCohortCases(fieldsToQuery);
  const availableCohorts = useCoreSelector(selectAvailableCohorts);
    console.log(availableCohorts);

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
              data={data.aggregations.map(d => d[fields[selectedCard]])}
              field={fields[selectedCard]}
              title={labels[selectedCard]}
            />
          ))}
        </div>
        <div className="p-1 flex basis-2/4">
          <CohortCard
            selectedCards={selectedCards}
            setSelectedCards={setSelectedCards}
            options={labels}
            counts={data?.caseCounts}
          />
        </div>
      </div>
    </>
  );
};

export default CohortComparison;
