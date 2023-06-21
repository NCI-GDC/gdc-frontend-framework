import { useState } from "react";

import {
  SelectedEntities,
  SetOperationEntityType,
} from "@/features/set-operations/types";
import SetOperationsForCohorts from "@/features/set-operations/SetOperationsForCohorts";
import SetOperationsPanel from "@/features/set-operations/SetOperationsPanel";

const SetOperationsForGenesSSMSCohorts = (): JSX.Element => {
  const [selectedEntities, setSelectedEntities] = useState<SelectedEntities>(
    [],
  );
  const [selectedEntityType, setSelectedEntityType] = useState<
    SetOperationEntityType | undefined
  >(undefined);

  return selectedEntityType !== "cohort" ? ( // not a cohort, so presumably an existing gene or mutation set
    // use the set operations panel as usual
    <SetOperationsPanel
      selectedEntities={selectedEntities}
      selectedEntityType={selectedEntityType}
      setSelectedEntities={setSelectedEntities}
      setSelectedEntityType={setSelectedEntityType}
      isLoading={false}
    />
  ) : (
    // handle cohorts  as they require case set to be available
    <SetOperationsForCohorts
      selectedEntities={selectedEntities}
      setSelectedEntities={setSelectedEntities}
      selectedEntityType={selectedEntityType}
      setSelectedEntityType={setSelectedEntityType}
    />
  );
};

export default SetOperationsForGenesSSMSCohorts;
