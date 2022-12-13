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
  resetSelectedCases,
} from "@gff/core";
import { showNotification } from "@mantine/notifications";
import { NewCohortNotificationWithSetAsCurrent } from "@/features/cohortBuilder/CohortNotifications";
import tw from "tailwind-styled-components";

interface CountsIconProps {
  $count?: number;
}

export const CountsIcon = tw.div<CountsIconProps>`
${(p: CountsIconProps) =>
  p.$count !== undefined && p.$count > 0 ? "bg-primary" : "bg-transparent"}
inline-flex
items-center
justify-center
w-8
h-6
text-primary-contrast
font-heading
rounded-md

`;

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
    coreDispatch(resetSelectedCases());
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
      color="primary"
      disabled={pickedProjects.length == 0}
      leftIcon={
        pickedProjects.length ? (
          <CountsIcon $count={pickedProjects.length}>
            {" "}
            {pickedProjects.length}{" "}
          </CountsIcon>
        ) : null
      }
      onClick={() => createCohortFromProjects()}
    >
      Create New Cohort
    </Button>
  );
};

export default ProjectsCohortButton;
