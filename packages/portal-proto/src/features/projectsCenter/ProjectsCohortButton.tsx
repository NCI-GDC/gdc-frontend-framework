import React, { useEffect } from "react";
import { Button } from "@mantine/core";
import { useAppSelector } from "@/features/projectsCenter/appApi";
import { selectPickedProjects } from "@/features/projectsCenter/pickedProjectsSlice";
import {
  FilterSet,
  clearCohortMessage,
  selectCohortMessage,
  useCoreSelector,
  useCoreDispatch,
  addNewCohortWithFilterAndMessage,
} from "@gff/core";
import { showNotification } from "@mantine/notifications";
import { NewCohortNotificationWithSetAsCurrent } from "@/features/cohortBuilder/CohortNotifications";

const ProjectsCohortButton = (): JSX.Element => {
  const pickedProjects: ReadonlyArray<string> = useAppSelector((state) =>
    selectPickedProjects(state),
  );
  const cohortMessage = useCoreSelector((state) => selectCohortMessage(state));
  const coreDispatch = useCoreDispatch();

  const createCohortFromProjects = () => {
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
    coreDispatch(
      addNewCohortWithFilterAndMessage({
        filters: filters,
        message: "newProjectsCohort",
      }),
    );
  };

  useEffect(() => {
    if (cohortMessage) {
      const cmdAndParam = cohortMessage.split("|", 3);
      if (cmdAndParam.length == 3) {
        if (cmdAndParam[0] === "newProjectsCohort") {
          showNotification({
            message: (
              <NewCohortNotificationWithSetAsCurrent
                cohortName={cmdAndParam[1]}
                cohortId={cmdAndParam[2]}
              />
            ),
            classNames: {
              description: "flex flex-col content-center text-center",
            },
            autoClose: 5000,
          });
        }
      }
      coreDispatch(clearCohortMessage());
    }
  }, [cohortMessage, coreDispatch]);

  return (
    <Button
      variant="outline"
      disabled={pickedProjects.length == 0}
      leftIcon={
        pickedProjects.length ? (
          <div className="inline-flex items-center justify-center bg-primary w-6 h-6 text-primary-contrast rounded-md">
            {pickedProjects.length}
          </div>
        ) : null
      }
      onClick={() => createCohortFromProjects()}
    >
      Create Cohort
    </Button>
  );
};

export default ProjectsCohortButton;
