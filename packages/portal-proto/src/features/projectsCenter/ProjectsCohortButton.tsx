import React, { useState } from "react";
import { Button, Tooltip } from "@mantine/core";
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
  useCoreDispatch,
  addNewCohortWithFilterAndMessage,
} from "@gff/core";
import CreateCohortModal from "@/components/Modals/CreateCohortModal";
import { CountsIcon } from "../shared/tailwindComponents";

const ProjectsCohortButton = (): JSX.Element => {
  const pickedProjects: ReadonlyArray<string> = useAppSelector((state) =>
    selectPickedProjects(state),
  );
  const coreDispatch = useCoreDispatch();
  const appDispatch = useAppDispatch();
  const [showCreateCohort, setShowCreateCohort] = useState(false);

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

  return (
    <>
      <Tooltip
        label="Create a new unsaved cohort of cases in selected project(s)"
        withArrow
      >
        <span>
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
        </span>
      </Tooltip>
      {showCreateCohort && (
        <CreateCohortModal
          onClose={() => setShowCreateCohort(false)}
          onActionClick={(newName: string) => {
            createCohortFromProjects(newName);
          }}
        />
      )}
    </>
  );
};

export default ProjectsCohortButton;
