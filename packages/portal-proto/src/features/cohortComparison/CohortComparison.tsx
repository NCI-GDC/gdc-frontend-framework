import { useState } from "react";
import CohortCard from "./CohortCard";
import SurvivalCard from "./SurvivalCard";

const CohortComparison = () => {
  const [selectedCards, setSelectedCards] = useState({ survival: true });
  
  return (
    <>
      <h1>Cohort Comparison</h1>
      <div className="flex">
      <div className="p-1">
        {selectedCards.survival && <SurvivalCard />}
      </div>
      <div className="p-1">
        <CohortCard
          selectedCards={selectedCards}
          setSelectedCards={setSelectedCards}
        />
      </div>
      </div>
    </>
  );
};

export default CohortComparison;
