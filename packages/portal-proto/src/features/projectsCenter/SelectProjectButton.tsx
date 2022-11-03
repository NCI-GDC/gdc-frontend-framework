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
} from "@/features/projectsCenter/selectedProjectsSlice";
import { isEqual } from "lodash";

interface SelectProjectButtonProps {
  readonly projectId: string;
}

interface SelectAllProjectButtonProps {
  projectIds: ReadonlyArray<string>;
}

export const SelectProjectButton = ({
  projectId,
}: SelectProjectButtonProps) => {
  const selectedProjects = useAppSelector((state) =>
    selectPickedProjects(state),
  );
  const dispatch = useAppDispatch();

  return (
    <Checkbox
      checked={Object.keys(selectedProjects).includes(projectId)}
      onClick={(event) => {
        event
          ? dispatch(addProject({ projectId: projectId }))
          : dispatch(removeProject(projectId));
      }}
    ></Checkbox>
  );
};

export const SelectAllProjectsButton = ({
  projectIds,
}: SelectAllProjectButtonProps) => {
  const selectedProjects = useAppSelector((state) =>
    selectPickedProjects(state),
  );
  const dispatch = useAppDispatch();

  return (
    <Checkbox
      checked={isEqual(projectIds, selectedProjects)}
      onClick={(event) => {
        event
          ? dispatch(
              addProjects(
                projectIds.map((x) => {
                  return { projectId: x };
                }),
              ),
            )
          : dispatch(removeProjects(projectIds));
      }}
    ></Checkbox>
  );
};
