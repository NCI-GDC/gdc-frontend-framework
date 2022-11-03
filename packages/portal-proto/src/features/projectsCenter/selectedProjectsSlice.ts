import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { AppState } from "./appApi";

interface ProjectsCart {
  readonly projectId: string;
}

const selectedProjectsAdapter = createEntityAdapter<ProjectsCart>({
  selectId: (p) => p.projectId,
  sortComparer: (a, b) => a.projectId.localeCompare(b.projectId),
});

const selectedProjectsSlice = createSlice({
  name: "books",
  initialState: selectedProjectsAdapter.getInitialState(),
  reducers: {
    // Can pass adapter functions directly as case reducers.  Because we're passing this
    // as a value, `createSlice` will auto-generate the `bookAdded` action type / creator
    addProject: selectedProjectsAdapter.addOne,
    addProjects: selectedProjectsAdapter.addMany,
    removeProject: selectedProjectsAdapter.removeOne,
    removeProjects: selectedProjectsAdapter.removeMany,
    clearAllProjects: selectedProjectsAdapter.removeAll,
    addAllProjects: selectedProjectsAdapter.addMany,
  },
});

export const selectedProjectsReducer = selectedProjectsSlice.reducer;
export const {
  addProject,
  addProjects,
  removeProject,
  removeProjects,
  clearAllProjects,
  addAllProjects,
} = selectedProjectsSlice.actions;

const selectedProjectsSelectors =
  selectedProjectsAdapter.getSelectors<AppState>((state) => state.selected);

export const selectPickedProjects = (state: AppState) =>
  selectedProjectsSelectors.selectEntities(state);
