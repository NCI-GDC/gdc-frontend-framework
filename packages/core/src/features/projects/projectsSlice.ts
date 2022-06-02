import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DataStatus } from "../../dataAccess";
import { CoreDataSelectorResponse } from "../../dataAccess";
import { CoreDispatch, CoreState } from "../../store";
import {
  fetchGdcProjects,
  GdcApiRequest,
  GdcApiResponse,
  ProjectDefaults,
} from "../gdcapi/gdcapi";

export interface Project {
  readonly name: string;
  readonly projectId: string;
  readonly disease_type: Array<string>;
  readonly primary_site: Array<string>;
  readonly summary?: {
    readonly case_count: number;
    readonly file_count: number;
    readonly file_size: number;
  };
  readonly program?: {
    readonly dbgap_accession_number: string;
    readonly name: string;
    readonly program_id: string;
  };
}

export const fetchProjects = createAsyncThunk<
  GdcApiResponse<ProjectDefaults>,
  GdcApiRequest,
  { dispatch: CoreDispatch; state: CoreState }
>("facet/fetchProjects", async (request?: GdcApiRequest) => {
  return await fetchGdcProjects(request);
});

export interface ProjectsState {
  // projects by project id
  readonly projects: Record<string, Project>;
  readonly status: DataStatus;
  readonly error?: string;
}

const initialState: ProjectsState = {
  projects: {},
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

        if (response.warnings && Object.keys(response.warnings).length > 0) {
          state.status = "rejected";
          state.error = response.warnings.facets;
        } else {
          if (response.data.hits) {
            state.projects = response.data.hits.reduce(
              (projects: Record<string, Project>, hit: ProjectDefaults) => {
                projects[hit.project_id] = {
                  name: hit.name,
                  projectId: hit.project_id,
                  disease_type: [...hit.disease_type],
                  primary_site: [...hit.primary_site],
                  summary: hit.summary,
                  program: hit.program,
                };
                return projects;
              },
              {},
            );
          } else {
            state.projects = {};
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

export const selectProjectsState = (state: CoreState): ProjectsState =>
  state.projects;

export const selectProjects = (state: CoreState): ReadonlyArray<Project> => {
  return Object.values(state.projects.projects);
};

export const selectProjectsData = (
  state: CoreState,
): CoreDataSelectorResponse<ReadonlyArray<Project>> => {
  return {
    data: Object.values(state.projects.projects),
    status: state.projects.status,
    error: state.projects.error,
  };
};
