import React, { useState } from "react";
import { Button, Tooltip } from "@mantine/core";
import { CountsIcon } from "@/components/tailwindComponents";
import SaveCohortModal from "@/components/Modals/SaveCohortModal";

const ProjectsCohortButton = ({
  pickedProjects,
}: {
  pickedProjects: string[];
}): JSX.Element => {
  const [showSaveCohort, setShowSaveCohort] = useState(false);

  return (
    <>
      <Tooltip
        label="Save a new cohort of cases in selected project(s)"
        withArrow
      >
        <span>
          <Button
            data-testid="button-create-new-cohort-projects-table"
            variant="outline"
            color="primary"
            disabled={pickedProjects.length == 0}
            leftSection={
              pickedProjects.length ? (
                <CountsIcon $count={pickedProjects.length}>
                  {pickedProjects.length}{" "}
                </CountsIcon>
              ) : null
            }
            onClick={() => setShowSaveCohort(true)}
            className="border-primary data-disabled:opacity-50 data-disabled:bg-base-max data-disabled:text-primary"
          >
            Save New Cohort
          </Button>
        </span>
      </Tooltip>

      <SaveCohortModal
        opened={showSaveCohort}
        onClose={() => setShowSaveCohort(false)}
        filters={{
          mode: "and",
          root: {
            "cases.project.project_id": {
              operator: "includes",
              field: "cases.project.project_id",
              operands: pickedProjects,
            },
          },
        }}
      />
    </>
  );
};

export default ProjectsCohortButton;
