import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUseCoreDataHook,
  DataStatus,
  CoreDataSelectorResponse,
} from "../../dataAccess";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import { GraphQLApiResponse, graphqlAPI } from "../gdcapi/gdcgraphql";

const graphQLQuery = `
  query CDaveFields {
    introspectiveType: __type(name: "ExploreCases") {
      name
      fields {
        name
        description
        type {
          name
          fields {
            name
            description
            type {
              name
            }
          }
        }
      }
    }
  }
`;

export const fetchClinicalFieldsResult = createAsyncThunk<
  GraphQLApiResponse,
  void,
  { dispatch: CoreDispatch; state: CoreState }
>("clinicalFields", async () => {
  return await graphqlAPI(graphQLQuery, {});
});

interface CDaveField {
  readonly description?: string;
  readonly name: string;
}

export interface ClinicalFieldsResult {
  data: CDaveField[];
  status: DataStatus;
}

const initialState: ClinicalFieldsResult = {
  data: [],
  status: "uninitialized",
};

const slice = createSlice({
  name: "clinicalFields",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClinicalFieldsResult.fulfilled, (state, action) => {
        const response = action.payload;

        if (response.errors) {
          state.status = "rejected";
        } else {
          state.status = "fulfilled";
          state.data = response.data.introspectiveType.fields[1].type.fields;
        }
        return state;
      })
      .addCase(fetchClinicalFieldsResult.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchClinicalFieldsResult.rejected, (state) => {
        state.status = "rejected";
        return state;
      });
  },
});

export const clinicalFieldsReducer = slice.reducer;

export const selectClinicalFieldsData = (
  state: CoreState,
): CoreDataSelectorResponse<CDaveField[]> => {
  return {
    data: state.clinicalDataAnalysis.fields.data,
    status: state.clinicalDataAnalysis.fields.status,
  };
};

export const useClinicalFields = createUseCoreDataHook(
  fetchClinicalFieldsResult,
  selectClinicalFieldsData,
);
