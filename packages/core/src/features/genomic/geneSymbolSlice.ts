import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { graphqlAPI, GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import { CoreDataSelectorResponse, DataStatus } from "../../dataAccess";
import { castDraft } from "immer";
import { useCoreDispatch, useCoreSelector } from "../../hooks";
import { useEffect } from "react";

/**
 * Slice used to retrieve and cache GeneIds -\> Gene Symbols.
 */

const GeneSymbolQuery = `
          query GeneSymbol(
            $filters: FiltersArgument
          ) {
            viewer {
              explore {
                genes {
                  hits(filters: $filters, first: 1000) {
                    edges {
                      node {
                        symbol
                        gene_id
                      }
                    }
                  }
                }
              }
            }
          }
`;

export const fetchGeneSymbol = createAsyncThunk<
  GraphQLApiResponse,
  string[],
  { dispatch: CoreDispatch; state: CoreState }
>("genomic/fetchGeneSymbol", async (geneIds): Promise<GraphQLApiResponse> => {
  const filters = {
    filters: {
      content: [
        {
          content: {
            field: "genes.gene_id",
            value: geneIds,
          },
          op: "in",
        },
      ],
      op: "and",
    },
  };
  return await graphqlAPI(GeneSymbolQuery, filters);
});

export interface GeneSymbolState {
  readonly geneSymbols: Record<string, string>;
  readonly status: DataStatus;
  readonly error?: string;
  readonly requestId?: string;
}

const initialState: GeneSymbolState = {
  geneSymbols: {},
  status: "uninitialized",
};

interface GQLGeneSymbolResponse {
  readonly gene_id: string;
  readonly symbol: string;
}

const slice = createSlice({
  name: "genomic/geneSymbol",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeneSymbol.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.errors) {
          state = castDraft(initialState);
          state.status = "rejected";
          state.error = response.errors.toString();
          return state;
        }

        if (state.requestId != action.meta.requestId) return state;

        const data = response.data.viewer.explore.genes.hits.edges;
        const newSymbols = data
          .map((e: Record<string, never>) => e.node)
          .reduce(
            (symbols: Record<string, string>, x: GQLGeneSymbolResponse) => {
              symbols[x.gene_id] = x.symbol;
              return symbols;
            },
            {},
          );
        state.geneSymbols = {
          ...state.geneSymbols,
          ...newSymbols,
        };
        state.status = "fulfilled";
        state.error = undefined;
        return state;
      })
      .addCase(fetchGeneSymbol.pending, (state, action) => {
        const pendingSymbols = action.meta.arg.reduce(
          (prev: Record<string, string>, x) => {
            prev[x] = "pending";
            return prev;
          },
          {},
        );
        state.status = "pending";
        state.requestId = action.meta.requestId;
        state.geneSymbols = {
          ...state.geneSymbols,
          ...pendingSymbols,
        };
        return state;
      })
      .addCase(fetchGeneSymbol.rejected, (state, action) => {
        const rejectedSymbols = action.meta.arg.reduce(
          (prev: Record<string, string>, x) => {
            prev[x] = "No gene found.";
            return prev;
          },
          {},
        );

        state.status = "rejected";
        state.geneSymbols = rejectedSymbols;
        if (action.error) {
          state.error = action.error.message;
        }
        return state;
      });
  },
});

export const geneSymbolReducer = slice.reducer;

export const selectGeneSymbolById = (
  state: CoreState,
  geneId: string,
): string => state.genomic.geneSymbols.geneSymbols[geneId] ?? "Not Found";

export const selectGeneSymbol = (
  state: CoreState,
): CoreDataSelectorResponse<Record<string, string>> => {
  return {
    data: state.genomic.geneSymbols.geneSymbols,
    status: state.genomic.geneSymbols.status,
    error: state.genomic.geneSymbols.error,
  };
};

export const useGeneSymbol = (
  geneIds: string[],
): {
  data: Record<string, string> | undefined;
  error: string | undefined;
  isUninitialized: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
} => {
  const coreDispatch = useCoreDispatch();
  const { data, status, error } = useCoreSelector(selectGeneSymbol);

  const neededSymbols = geneIds.filter(
    (x) => !Object.keys(data ?? {}).includes(x),
  );

  useEffect(() => {
    if (neededSymbols.length > 0) {
      coreDispatch(fetchGeneSymbol(neededSymbols));
    }
  }, [coreDispatch, neededSymbols]);
  return {
    data,
    error,
    isUninitialized: status === "uninitialized",
    isFetching: status === "pending",
    isSuccess: status === "fulfilled",
    isError: status === "rejected",
  };
};
