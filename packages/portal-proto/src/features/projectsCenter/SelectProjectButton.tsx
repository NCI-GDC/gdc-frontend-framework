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
  const [checked, setChecked] = useState(false);
  const pickedProjects = useAppSelector((state) => selectPickedProjects(state));
  const dispatch = useAppDispatch();

  console.log("SelectProjectButton pickedProjects", pickedProjects);
  console.log("SelectProjectButton projectIds", projectId);

  useEffect(() => {
    setChecked(pickedProjects.includes(projectId));
  }, [projectId, pickedProjects]);

  return (
    <Checkbox
      checked={checked}
      onClick={(event) => {
        setChecked(event.currentTarget.checked);
        if (event.currentTarget.checked)
          dispatch(addProject({ projectId: projectId }));
        else dispatch(removeProject(projectId));
      }}
    ></Checkbox>
  );
};

export const SelectAllProjectsButton = ({
  projectIds,
}: SelectAllProjectButtonProps): JSX.Element => {
  const [checked, setChecked] = useState(false);
  const pickedProjects = useAppSelector((state) => selectPickedProjects(state));
  const dispatch = useAppDispatch();

  console.log("pickedProjects", pickedProjects);
  console.log("projectIds", projectIds);
  useEffect(() => {
    setChecked(isEqual(projectIds, pickedProjects));
  }, [projectIds, pickedProjects]);

  return (
    <Checkbox
      checked={checked}
      onClick={(event) => {
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
    ></Checkbox>
  );
};
