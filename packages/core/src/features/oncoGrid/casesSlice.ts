import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchGdcEntities } from "../gdcapi/gdcapi";
import { CoreDataSelectorResponse, DataStatus } from "../../dataAcess";
import { CoreState } from "../../store";
import { createUseCoreDataHook, GraphQLApiResponse } from "../..";

export interface CasesState {
  readonly status: DataStatus;
  readonly data: any;
  readonly error?: string;
}

const initialState: CasesState = {
  data: [],
  status: "uninitialized",
};

export const fetchCases = createAsyncThunk(
  "oncogrid/fetchCases",
  async ({ genes } : { genes: string[] }) : Promise<GraphQLApiResponse> => {
    return fetchGdcEntities("analysis/top_mutated_cases_by_gene", {
      fields: [
        "demographic.days_to_death",
        "diagnoses.age_at_diagnosis",
        "demographic.vital_status",
        "demographic.gender",
        "demographic.race",
        "demographic.ethnicity",
        "case_id",
        "submitter_id",
        "project.project_id",
        "summary.data_categories.file_count",
        "summary.data_categories.data_category",
      ],
      size: 200,
      filters: {
        op: "and",
        content: [
          {
            op: "in",
            content: {
              field: "genes.gene_id",
              value: genes,
            },
          },
          {
            content: {
              field: "genes.is_cancer_gene_census",
              value: ["true"],
            },
            op: "in",
          },
          {
            op: "not",
            content: {
              field: "ssms.consequence.transcript.annotation.vep_impact",
              value: "missing",
            },
          },
          {
            op: "in",
            content: {
              field: "ssms.consequence.transcript.consequence_type",
              value: [
                "missense_variant",
                "frameshift_variant",
                "start_lost",
                "stop_lost",
                "stop_gained",
              ],
            },
          },
        ],
      },
    });
  },
);

const slice = createSlice({
  name: "cases",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCases.fulfilled, (state) => {
        state.status = "fulfilled";
        state.error = undefined;
        return state;
      })
      .addCase(fetchCases.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchCases.rejected, (state, action) => {
        state.status = "rejected";

        if (action.error) {
          state.error = action.error.message;
        }

        return state;
      });
  },
});

export const casesReducer = slice.reducer;

export const casesState = (state: any) => state.oncogrid.cases;

export const selectCasesData = (
  state: CoreState,
): CoreDataSelectorResponse<CasesState> => {
  return {
    data: state.oncogrid.cases.data,
    status: state.oncogrid.cases.status,
    error: state.oncogrid.cases.error,
  };
};

export const useOncoGridCases = createUseCoreDataHook(
  fetchCases,
  selectCasesData,
)