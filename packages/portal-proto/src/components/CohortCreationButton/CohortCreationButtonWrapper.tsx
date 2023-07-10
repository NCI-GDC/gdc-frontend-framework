import React, { ReactNode, useState } from "react";
import {
  FilterSet,
  useCoreDispatch,
  addNewCohortWithFilterAndMessage,
} from "@gff/core";
import CreateCohortModal from "../Modals/CreateCohortModal";
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
  const [showCreateCohort, setShowCreateCohort] = useState(false);
  const coreDispatch = useCoreDispatch();

  const createCohort = (name: string) => {
    coreDispatch(
      addNewCohortWithFilterAndMessage({
        filters: caseFilters,
        name,
        message: "newCasesCohort",
      }),
    );
  };

  return (
    <div className="p-1">
      <CohortCreationButton
        label={label}
        numCases={numCases}
        handleClick={() => {
          setShowCreateCohort(true);
        }}
      />

      {showCreateCohort && (
        <CreateCohortModal
          onClose={() => setShowCreateCohort(false)}
          onActionClick={(newName: string) => {
            createCohort(newName);
          }}
        />
      )}
    </div>
  );
};

export default CohortCreationButtonWrapper;
