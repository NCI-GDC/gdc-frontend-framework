import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DataStatus, CoreDataSelectorResponse } from "../../dataAccess";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import {
  fetchGdcProjects,
  GdcApiRequest,
  GdcApiResponse,
  ProjectDefaults,
} from "../gdcapi/gdcapi";

export const fetchProjects = createAsyncThunk<
  GdcApiResponse<ProjectDefaults>,
  GdcApiRequest,
  { dispatch: CoreDispatch; state: CoreState }
>("facet/fetchProjects", async (request?: GdcApiRequest) => {
  return await fetchGdcProjects(request);
});

export interface ProjectsState {
  readonly projectData?: ProjectDefaults;
  readonly status: DataStatus;
  readonly error?: string;
}

const initialState: ProjectsState = {
  projectData: undefined,
  status: "uninitialized",
};

const slice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.fulfilled, (state, action) => {
        const response = action.payload;
        console.log(response);
        if (response.warnings && Object.keys(response.warnings).length > 0) {
          state.status = "rejected";
          state.error = response.warnings.facets;
        } else {
          if (response.data.hits) {
            state.projectData = { ...response.data.hits[0] };
          } else {
            state.projectData = undefined;
          }
          state.status = "fulfilled";
        }
      })
      .addCase(fetchProjects.pending, (state) => {
        state.status = "pending";
        state.error = undefined;
      })
      .addCase(fetchProjects.rejected, (state) => {
        state.status = "rejected";
        // TODO get error from action
        state.error = undefined;
      });
  },
});

export const projectsReducer = slice.reducer;

export const selectProjectsData = (
  state: CoreState,
): CoreDataSelectorResponse<ProjectDefaults> => {
  return {
    data: state.projects.projectData,
    status: state.projects.status,
    error: state.projects.error,
  };
};
