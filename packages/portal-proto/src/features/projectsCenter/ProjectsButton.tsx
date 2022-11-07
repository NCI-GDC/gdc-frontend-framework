import React from "react";
import { Button } from "@mantine/core";
import { useAppSelector } from "@/features/projectsCenter/appApi";
import { selectPickedProjects } from "@/features/projectsCenter/pickedProjectsSlice";

const ProjectsButton = (): JSX.Element => {
  const pickedProjects = useAppSelector((state) => selectPickedProjects(state));
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
    >
      Create Cohort
    </Button>
  );
};

export default ProjectsButton;
