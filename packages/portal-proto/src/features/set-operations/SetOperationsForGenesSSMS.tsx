import { SetOperationsForGenesSSMSCasesProps } from "@/features/set-operations/types";
import SetOperationsPanel from "@/features/set-operations/SetOperationsPanel";

const SetOperationsForGenesSSMS = ({
  selectedEntities,
  setSelectedEntities,
  selectedEntityType,
  setSelectedEntityType,
}: SetOperationsForGenesSSMSCasesProps): JSX.Element => {
  return (
    <SetOperationsPanel
      selectedEntities={selectedEntities}
      selectedEntityType={selectedEntityType}
      setSelectedEntities={setSelectedEntities}
      setSelectedEntityType={setSelectedEntityType}
      isLoading={false}
    />
  );
};

export default SetOperationsForGenesSSMS;
