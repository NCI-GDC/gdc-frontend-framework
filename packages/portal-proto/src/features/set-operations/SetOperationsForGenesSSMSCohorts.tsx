import { useEffect, useState } from "react";

import {
  useCoreSelector,
  useCreateCaseSetFromFiltersMutation,
  selectCohortGqlFiltersById,
  selectCohortById,
} from "@gff/core";
import { showNotification } from "@mantine/notifications";
import {
  SelectedEntities,
  SetOperationEntityType,
  SelectedEntity,
} from "@/features/set-operations/types";
import { useAppDispatch, useAppSelector } from "./appApi";
import { selectCommand, addCohort } from "./cohortCaseSetsSlice";
import SetOperationsPanel from "@/features/set-operations/SetOperationsPanel";

// process the selected cohorts, creating a set for each one
// TODO remove eslint disable once we have a real implementation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useCreateCaseSetFromCohorts = (
  selectedEntityType: SetOperationEntityType,
  entity: SelectedEntity,
) => {
  const [createSet, response] = useCreateCaseSetFromFiltersMutation();
  // const cohorts = useCoreSelector((state) =>
  //   selectAvailableCohortsAsMap(state),
  // );
  const cohort = useCoreSelector((state) => selectCohortById(state, entity.id));
  const filters = useCoreSelector((state) =>
    selectCohortGqlFiltersById(state, entity.id),
  );
  const dispatch = useAppDispatch();
  const needsCreation = useAppSelector((state) => selectCommand(state, cohort));

  if (selectedEntityType !== "cohort") return true;
  if (!cohort) return false;
  if (needsCreation === "create") {
    createSet({
      filters: filters,
      size: cohort.caseCount,
      sort: "case.project.project_id",
      id: `set-ops-cohort-${entity.id}`,
    }).then((result) => {
      if ("data" in result) {
        dispatch(
          addCohort({
            cohort: cohort,
            createdFilters: filters,
            caseSetId: result.data as string,
          }),
        );
      } else if (result.error) {
        showNotification({ message: "Problem saving set.", color: "red" });
        return false;
      }
    });
    return response.isSuccess;
  }
  return true;
};

const SetOperationsForGenesSSMSCohorts = () => {
  const [selectedEntities, setSelectedEntities] = useState<SelectedEntities>(
    [],
  );
  const [selectedEntityType, setSelectedEntityType] = useState<
    SetOperationEntityType | undefined
  >(undefined);

  useEffect(() => {
    if (selectedEntityType === "cohort") {
      console.log("selectedEntityType is cohort");
    }
  }, [selectedEntities, selectedEntityType]);

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

export default SetOperationsForGenesSSMSCohorts;
