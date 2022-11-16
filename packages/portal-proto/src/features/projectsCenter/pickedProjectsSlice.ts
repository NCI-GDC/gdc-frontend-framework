import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { AppState } from "./appApi";

interface ProjectsCart {
  readonly projectId: string;
}

const pickedProjectsAdapter = createEntityAdapter<ProjectsCart>({
  selectId: (p) => p.projectId,
  sortComparer: (a, b) => a.projectId.localeCompare(b.projectId),
});

const pickedProjectsSlice = createSlice({
  name: "projectApp/pickedProjects",
  initialState: pickedProjectsAdapter.getInitialState(),
  reducers: {
    addProject: pickedProjectsAdapter.addOne,
    addProjects: pickedProjectsAdapter.addMany,
    removeProject: pickedProjectsAdapter.removeOne,
    removeProjects: pickedProjectsAdapter.removeMany,
  },
});

export const pickedProjectsReducer = pickedProjectsSlice.reducer;
export const { addProject, addProjects, removeProject, removeProjects } =
  pickedProjectsSlice.actions;

const pickedProjectsSelectors = pickedProjectsAdapter.getSelectors<AppState>(
  (state) => state.selected,
);

export const selectPickedProjects = (state: AppState): ReadonlyArray<string> =>
  pickedProjectsSelectors.selectIds(state).map((x) => x as string);
