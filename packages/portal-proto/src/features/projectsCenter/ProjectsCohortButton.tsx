import React, { useState } from "react";
import { Button } from "@mantine/core";
import {
  useAppSelector,
  useAppDispatch,
} from "@/features/projectsCenter/appApi";
import {
  resetPickedProjects,
  selectPickedProjects,
} from "@/features/projectsCenter/pickedProjectsSlice";
import {
  FilterSet,
  useCoreSelector,
  useCoreDispatch,
  addNewCohortWithFilterAndMessage,
  selectAvailableCohorts,
} from "@gff/core";
import { SaveOrCreateCohortModal } from "@/components/Modals/SaveOrCreateCohortModal";
import { CountsIcon } from "../shared/tailwindComponents";

const ProjectsCohortButton = (): JSX.Element => {
  const pickedProjects: ReadonlyArray<string> = useAppSelector((state) =>
    selectPickedProjects(state),
  );
  const coreDispatch = useCoreDispatch();
  const appDispatch = useAppDispatch();
  const [showCreateCohort, setShowCreateCohort] = useState(false);
  const cohorts = useCoreSelector((state) => selectAvailableCohorts(state));

  const createCohortFromProjects = (name: string) => {
    const filters: FilterSet = {
      mode: "and",
      root: {
        "cases.project.project_id": {
          operator: "includes",
          field: "cases.project.project_id",
          operands: pickedProjects,
        },
      },
    };
    appDispatch(resetPickedProjects());
    coreDispatch(
      addNewCohortWithFilterAndMessage({
        filters: filters,
        name,
        message: "newProjectsCohort",
      }),
    );
  };

  const onNameChange = (name: string) =>
    cohorts.every((cohort) => cohort.name !== name);

  return (
    <>
      <Button
        data-testid="button-create-new-cohort-projects-table"
        variant="outline"
        color="primary"
        disabled={pickedProjects.length == 0}
        leftIcon={
          pickedProjects.length ? (
            <CountsIcon $count={pickedProjects.length}>
              {pickedProjects.length}{" "}
            </CountsIcon>
          ) : null
        }
        onClick={() => setShowCreateCohort(true)}
        className="border-primary data-disabled:opacity-50 data-disabled:bg-base-max data-disabled:text-primary"
      >
        Create New Cohort
      </Button>
      {showCreateCohort && (
        <SaveOrCreateCohortModal
          entity="cohort"
          action="create"
          opened
          onClose={() => setShowCreateCohort(false)}
          onActionClick={(newName: string) => {
            createCohortFromProjects(newName);
          }}
          onNameChange={onNameChange}
        />
      )}
    </>
  );
};

export default ProjectsCohortButton;
