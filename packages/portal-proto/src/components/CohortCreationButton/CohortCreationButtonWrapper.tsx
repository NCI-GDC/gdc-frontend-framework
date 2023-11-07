import React, { ReactNode, useState } from "react";
import { FilterSet } from "@gff/core";
import SaveCohortModal from "@/components/Modals/SaveCohortModal";
import CohortCreationButton from "./CohortCreationButton";

interface CohortCreationButtonWrapperProps {
  readonly caseFilters?: FilterSet;
  readonly label: ReactNode;
  readonly numCases: number;
}

const CohortCreationButtonWrapper: React.FC<
  CohortCreationButtonWrapperProps
> = ({
  caseFilters = undefined,
  label,
  numCases,
}: CohortCreationButtonWrapperProps) => {
  const [showSaveCohort, setShowSaveCohort] = useState(false);

  return (
    <div className="p-1">
      <CohortCreationButton
        label={label}
        numCases={numCases}
        handleClick={() => {
          setShowSaveCohort(true);
        }}
      />

      {showSaveCohort && (
        <SaveCohortModal
          onClose={() => setShowSaveCohort(false)}
          filters={caseFilters}
        />
      )}
    </div>
  );
};

export default CohortCreationButtonWrapper;
