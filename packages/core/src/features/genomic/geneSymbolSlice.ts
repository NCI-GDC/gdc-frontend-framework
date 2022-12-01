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
import { GenesDefaults } from "../gdcapi/gdcapi";

const GeneSymbolQuery = `
           viewer {
              explore {
                genes {
                  hits(filters: $filters, first: 1) {
                    edges {
                      node {
                        symbol
                      }
                    }
                  }
                }
              }
            }`;

export const fetchGeneSymbol = createAsyncThunk<
  GraphQLApiResponse,
  string,
  { dispatch: CoreDispatch; state: CoreState }
>("genes/geneFrequencyChart", async (geneId): Promise<GraphQLApiResponse> => {
  const filters = {
    variables: {
      filters: {
        op: "and",
        content: [
          {
            op: "in",
            content: {
              field: "genes.gene_id",
              value: [geneId],
            },
          },
        ],
      },
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
        const data = response.data as GenesDefaults;
        state.geneSymbols = {
          ...state.geneSymbols,
          [action.meta.arg]: data.symbol,
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
