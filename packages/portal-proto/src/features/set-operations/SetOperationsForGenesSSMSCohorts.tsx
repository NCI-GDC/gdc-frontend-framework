import { useState } from "react";

import {
  SelectedEntities,
  SetOperationEntityType,
} from "@/features/set-operations/types";
import SetOperationsForGenesSSMS from "@/features/set-operations/SetOperationsForGenesSSMS";
import SetOperationsForCohorts from "@/features/set-operations/SetOperationsForCohorts";

const SetOperationsForGenesSSMSCohorts = (): JSX.Element => {
  const [selectedEntities, setSelectedEntities] = useState<SelectedEntities>(
    [],
  );
  const [selectedEntityType, setSelectedEntityType] = useState<
    SetOperationEntityType | undefined
  >(undefined);

  return selectedEntityType !== "cohort" ? (
    <SetOperationsForGenesSSMS
      selectedEntities={selectedEntities}
      setSelectedEntities={setSelectedEntities}
      selectedEntityType={selectedEntityType}
      setSelectedEntityType={setSelectedEntityType}
    />
  ) : (
    <SetOperationsForCohorts
      selectedEntities={selectedEntities}
      setSelectedEntities={setSelectedEntities}
      selectedEntityType={selectedEntityType}
      setSelectedEntityType={setSelectedEntityType}
    />
  );
};

export default SetOperationsForGenesSSMSCohorts;
