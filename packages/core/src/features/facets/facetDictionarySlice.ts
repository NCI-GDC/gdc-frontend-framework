import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GraphQLApiResponse, GraphQLFetchError } from "../gdcapi/gdcgraphql";
import { FacetDefinition } from "./types";
import { CoreDispatch, CoreState } from "../../store";
import { DataStatus } from "../../dataAccess";
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

export const fetchFieldDictionary = createAsyncThunk<
  GraphQLApiResponse<Record<string, FacetDefinition>>,
  void,
  { dispatch: CoreDispatch; state: CoreState }
>("facet/fetchFieldDictionary", async (_) => {
  const res = await fetch("https://api.gdc.cancer.gov/v0/graphql/_mapping", {
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
  name: "facet/fetchFieldDictionary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFieldDictionary.fulfilled, (_, action) => {
        const response = action.payload;
        if (response.errors && Object.keys(response.errors).length > 0)
          return {
            entries: {},
            status: "rejected",
          };

        return {
          status: "fulfilled",
          entries: processDictionaryEntries(response.data),
        };
      })
      .addCase(fetchFieldDictionary.pending, () => {
        return {
          entries: {},
          status: "pending",
        };
      })
      .addCase(fetchFieldDictionary.rejected, () => {
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
  field: string,
): FacetDefinition => {
  return state.facetsGQL.dictionary.entries?.[field];
};
