import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { graphqlAPI, GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { castDraft } from "immer";

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
        }
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
      .addCase(fetchGeneSymbol.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchGeneSymbol.rejected, (state, action) => {
        state.status = "rejected";
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

export const useGeneSymbol = createUseCoreDataHook(
  fetchGeneSymbol,
  selectGeneSymbol,
);
