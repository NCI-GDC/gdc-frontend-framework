import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GraphQLFetchError } from "../gdcapi/gdcgraphql";
import { FacetDefinition } from "./types";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { processDictionaryEntries } from "./facetDictionaryApi";

const buildGraphMappingFetchError = async (
  res: Response,
): Promise<GraphQLFetchError> => {
  return {
    url: res.url,
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
  };
};

export const fetchFacetDictionary = createAsyncThunk<
  Record<string, FacetDefinition>,
  void,
  { dispatch: CoreDispatch; state: CoreState }
>("facet/fetchFacetDictionary", async () => {
  const res = await fetch("https://api.gdc.cancer.gov/v0/gql/_mapping", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  if (res.ok) return res.json();

  throw await buildGraphMappingFetchError(res);
});

export interface FacetDefinitionState {
  readonly status: DataStatus;
  readonly error?: string;
  readonly entries: Record<string, FacetDefinition>;
}

const initialState: FacetDefinitionState = {
  status: "uninitialized",
  entries: {},
};

const facetDictionary = createSlice({
  name: "facet/fetchFacetDictionary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFacetDictionary.fulfilled, (_, action) => {
        const response = action.payload;
        if (response.errors && Object.keys(response.errors).length > 0)
          return {
            entries: {},
            status: "rejected",
          };

        return {
          status: "fulfilled",
          entries: processDictionaryEntries(response),
        };
      })
      .addCase(fetchFacetDictionary.pending, () => {
        return {
          entries: {},
          status: "pending",
        };
      })
      .addCase(fetchFacetDictionary.rejected, () => {
        return {
          entries: {},
          status: "rejected",
        };
      });
  },
});

export const facetDictionaryReducer = facetDictionary.reducer;

export const selectFacetDefinition = (
  state: CoreState,
): CoreDataSelectorResponse<Record<string, FacetDefinition>> => {
  return {
    data: state.facetsGQL.dictionary.entries,
    status: state.facetsGQL.dictionary.status,
    error: state.facetsGQL.dictionary.error,
  };
};

export const selectFacetDefinitionByName = (
  state: CoreState,
  field: string,
): FacetDefinition => {
  return state.facetsGQL.dictionary.entries?.[field];
};

export const selectFacetDefinitionsByName = (
  state: CoreState,
  fields: ReadonlyArray<string>,
): ReadonlyArray<FacetDefinition> => {
  return fields.flatMap((field) => {
    if (field in state.facetsGQL.dictionary.entries)
      return [state.facetsGQL.dictionary.entries[field]];
    else return [];
  });
};

export const useFacetDictionary = createUseCoreDataHook(
  fetchFacetDictionary,
  selectFacetDefinition,
);
