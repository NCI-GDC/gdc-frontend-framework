import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../../dataAccess";
import { CoreState } from "../../../reducers";
import { GraphQLApiResponse } from "../../gdcapi/gdcgraphql";
import { fetchGenesSummaryQuery, GeneSummaryResponse } from "./geneSummaryApi";

export const fetchGeneSummary = createAsyncThunk(
  "geneSummary/fetchGeneSummary",
  async ({
    gene_id,
  }: {
    gene_id: string;
  }): Promise<GraphQLApiResponse<GeneSummaryResponse>> => {
    return await fetchGenesSummaryQuery({ gene_id });
  },
);

export interface GeneSummaryData {
  symbol: string;
  name: string;
  synonyms: Array<string>;
  biotype: string;
  gene_chromosome: string;
  gene_start: number;
  gene_end: number;
  gene_strand: number;
  description: string;
  is_cancer_gene_census: boolean;
  civic?: string;
  gene_id: string;
  external_db_ids: {
    entrez_gene: string[];
    uniprotkb_swissprot: string[];
    hgnc: string[];
    omim_gene: string[];
  };
}

export interface geneSummaryInitialState {
  status: DataStatus;
  genes?: GeneSummaryData;
  readonly requestId?: string;
}

const initialState: geneSummaryInitialState = {
  status: "uninitialized",
};

const slice = createSlice({
  name: "geneSummary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeneSummary.fulfilled, (state, action) => {
        if (state.requestId != action.meta.requestId) return state;

        const response = action.payload;
        state.status = "fulfilled";

        const edges = response.data.viewer.explore.genes.hits.edges;
        if (edges.length === 0) return undefined;

        const summary = edges.map((gene) => ({
          symbol: gene.node.symbol,
          name: gene.node.name,
          synonyms: gene.node.synonyms,
          biotype: gene.node.biotype,
          gene_chromosome: gene.node.gene_chromosome,
          gene_start: gene.node.gene_start,
          gene_end: gene.node.gene_end,
          gene_strand: gene.node.gene_strand,
          description: gene.node.description,
          is_cancer_gene_census: gene.node.is_cancer_gene_census,
          gene_id: gene.node.gene_id,
          external_db_ids: {
            entrez_gene: gene.node.external_db_ids.entrez_gene,
            uniprotkb_swissprot: gene.node.external_db_ids.uniprotkb_swissprot,
            hgnc: gene.node.external_db_ids.hgnc,
            omim_gene: gene.node.external_db_ids.omim_gene,
          },
        }))[0];

        const civic = response.data.viewer.explore.ssms?.aggregations
          ?.clinical_annotations__civic__gene_id?.buckets[0]?.key
          ? response.data.viewer.explore.ssms?.aggregations
              ?.clinical_annotations__civic__gene_id?.buckets[0]?.key
          : undefined;

        state.genes = { ...summary, civic };
        return state;
      })
      .addCase(fetchGeneSummary.pending, (state, action) => {
        state.status = "pending";
        state.requestId = action.meta.requestId;
        return state;
      })
      .addCase(fetchGeneSummary.rejected, (state, action) => {
        if (state.requestId != action.meta.requestId) return state;
        state.status = "rejected";
        return state;
      });
  },
});

export const genesSummaryReducer = slice.reducer;

export const selectGenesSummaryData = (
  state: CoreState,
): CoreDataSelectorResponse<{ genes: GeneSummaryData | undefined }> => ({
  data: {
    genes: state.genesSummary.genes,
  },
  status: state.genesSummary.status,
});

export const useGenesSummaryData = createUseCoreDataHook(
  fetchGeneSummary,
  selectGenesSummaryData,
);
