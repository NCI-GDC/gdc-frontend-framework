import { useEffect, useState } from "react";
import { Checkbox } from "@mantine/core";
import {
  useAppSelector,
  useAppDispatch,
} from "@/features/projectsCenter/appApi";
import {
  selectPickedProjects,
  addProject,
  addProjects,
  removeProject,
  removeProjects,
} from "@/features/projectsCenter/pickedProjectsSlice";
import { isEqual } from "lodash";

interface SelectAllProjectButtonProps {
  projectIds: ReadonlyArray<string>;
}

interface SelectProjectButtonProps {
  readonly projectId: string;
}

export const SelectProjectButton = ({
  projectId,
}: SelectProjectButtonProps): JSX.Element => {
  const pickedProjects = useAppSelector((state) => selectPickedProjects(state));
  const dispatch = useAppDispatch();
  const [checked, setChecked] = useState(pickedProjects.includes(projectId));

  useEffect(() => {
    setChecked(pickedProjects.includes(projectId));
  }, [projectId, pickedProjects]);

  return (
    <Checkbox
      size="xs"
      checked={checked}
      className="ml-1"
      onChange={(event) => {
        setChecked(event.currentTarget.checked);
        if (event.currentTarget.checked)
          dispatch(addProject({ projectId: projectId }));
        else dispatch(removeProject(projectId));
      }}
    />
  );
};

export const SelectAllProjectsButton = ({
  projectIds,
}: SelectAllProjectButtonProps): JSX.Element => {
  const pickedProjects = useAppSelector((state) => selectPickedProjects(state));
  const dispatch = useAppDispatch();
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    // projectIds need to be in alphabetical order to compare
    setChecked(isEqual([...projectIds].sort(), pickedProjects));
  }, [projectIds, pickedProjects]);
  return (
    <Checkbox
      className="ml-1"
      size="xs"
      checked={checked}
      onChange={(event) => {
        setChecked(event.currentTarget.checked);
        if (event.currentTarget.checked)
          dispatch(
            addProjects(
              projectIds.map((x) => {
                return { projectId: x };
              }),
            ),
          );
        else dispatch(removeProjects(projectIds));
      }}
    />
  );
};
