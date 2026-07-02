import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { GraphQLFetchError } from "../gdcapi/gdcgraphql";
import { FacetDefinition, FacetDefinitionResponse } from "./types";
import { CoreDispatch, CoreState } from "src/store";
import {
  CoreDataSelector,
  DataStatus,
  FetchDataActionCreator,
  UseCoreDataResponse,
  UseCoreDataHook,
} from "../../dataAccess";
import { processDictionaryEntries } from "./facetDictionaryApi";
import { useCoreDispatch, useCoreSelector } from "../../hooks";
import { useEffect } from "react";
import { GDC_APP_API_AUTH } from "../../constants";

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
  Record<string, FacetDefinitionResponse>,
  void,
  { dispatch: CoreDispatch; state: CoreState }
>("facet/fetchFacetDictionary", async () => {
  const res = await fetch(`${GDC_APP_API_AUTH}/cases/_mapping`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  const fileRes = await fetch(`${GDC_APP_API_AUTH}/files/_mapping`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  if (res.ok && fileRes.ok) {
    const caseData = await res.json();
    const fileData = await fileRes.json();

    return {
      ...caseData["_mapping"],
      ...fileData["_mapping"],
    };
  }

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

const selectFacetDictionary = (state: CoreState) => state.facetsGQL.dictionary;

export const selectFacetDefinition = createSelector(
  [selectFacetDictionary],
  (dictionary) => ({
    data: dictionary.entries,
    status: dictionary.status,
    error: dictionary.error,
  }),
);

export const selectFacetDefinitionByName = (
  state: CoreState,
  field: string,
): FacetDefinition => {
  return state.facetsGQL.dictionary.entries?.[field];
};

const selectFacetDictionaryEntries = (state: CoreState) =>
  state.facetsGQL.dictionary.entries;

export const selectFacetDefinitionsByName = createSelector(
  [
    selectFacetDictionaryEntries,
    (_state: CoreState, fields: ReadonlyArray<string>) => fields,
  ],
  (entries, fields) =>
    fields.flatMap((field) => {
      if (field in entries) return [entries[field]];
      else return [];
    }),
);

const createUseDictionaryHook = <P, C, A, T>(
  fetchDataActionCreator: FetchDataActionCreator<P, C, A>,
  dataSelector: CoreDataSelector<T>,
): UseCoreDataHook<P, C, T> => {
  return (params: P, config?: C): UseCoreDataResponse<T> => {
    const coreDispatch = useCoreDispatch();
    const { data, pagination, status, error } = useCoreSelector(dataSelector);
    const action = fetchDataActionCreator(params, config);

    useEffect(() => {
      if (status === "uninitialized") {
        coreDispatch(action as any); // eslint-disable-line
      }
    }, [status, coreDispatch, action, params]);

    return {
      data,
      error,
      pagination,
      isUninitialized: status === "uninitialized",
      isFetching: status === "pending",
      isSuccess: status === "fulfilled",
      isError: status === "rejected",
    };
  };
};

export const useFacetDictionary = createUseDictionaryHook(
  fetchFacetDictionary,
  selectFacetDefinition,
);
