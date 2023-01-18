import { GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import {
  buildCohortGqlOperator,
  CoreDataSelectorResponse,
  CoreState,
  createUseCoreDataHook,
  DataStatus,
  FilterSet,
  graphqlAPI,
} from "@gff/core";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { castDraft } from "immer";

// interface GenomicTableDownloadProps extends TablePageOffsetProps {
//     totalCount: number;
// }

export const fetchMutatedGenesDownload = createAsyncThunk(
  "downloads/json",
  async (queryParams: any): Promise<GraphQLApiResponse> => {
    const { totalCount, genomicFilters } = queryParams;
    return await fetchedMutatedGenesJSON(totalCount, genomicFilters);
  },
);

export const dlMutatedGenesJSONQuery = `
query GenesTable(
  $genesTable_size: Int
  $genesTable_offset: Int
  $score: String
) {
  genesTableDownloadViewer: viewer {
    explore {
      genes {
        hits(
          first: $genesTable_size
          offset: $genesTable_offset
          score: $score
        ) {
          total
          edges {
            node {
              symbol
              name
              cytoband
              biotype
              gene_id
            }
          }
        }
      }
    }
  }
}
`;

export const fetchedMutatedGenesJSON = async (
  totalCount: number,
  genomicFilters: FilterSet,
): Promise<GraphQLApiResponse> => {
  const filters = buildCohortGqlOperator(genomicFilters);
  const filtersContent = filters?.content ? Object(filters?.content) : [];

  // v1 behavior for offset
  const graphQLFilters = {
    genesTable_size: totalCount,
    genesTable_offset: 0,
    score: "case.project.project_id",
    ssmCase: {
      op: "and",
      content: [
        {
          op: "in",
          content: {
            field: "cases.available_variation_data",
            value: ["ssm"],
          },
        },
        {
          op: "NOT",
          content: {
            field: "genes.case.ssm.observation.observation_id",
            value: "MISSING",
          },
        },
      ],
    },
    geneCaseFilter: {
      content: [
        ...[
          {
            content: {
              field: "cases.available_variation_data",
              value: ["ssm"],
            },
            op: "in",
          },
        ],
        ...filtersContent,
      ],
      op: "and",
    },
    ssmTested: {
      content: [
        {
          content: {
            field: "cases.available_variation_data",
            value: ["ssm"],
          },
          op: "in",
        },
      ],
      op: "and",
    },
    cnvTested: {
      op: "and",
      content: [
        ...[
          {
            content: {
              field: "cases.available_variation_data",
              value: ["cnv"],
            },
            op: "in",
          },
        ],
        ...filtersContent,
      ],
    },
    cnvGainFilters: {
      op: "and",
      content: [
        ...[
          {
            content: {
              field: "cases.available_variation_data",
              value: ["cnv"],
            },
            op: "in",
          },
          {
            content: {
              field: "cnvs.cnv_change",
              value: ["Gain"],
            },
            op: "in",
          },
        ],
        ...filtersContent,
      ],
    },
    cnvLossFilters: {
      op: "and",
      content: [
        ...[
          {
            content: {
              field: "cases.available_variation_data",
              value: ["cnv"],
            },
            op: "in",
          },
          {
            content: {
              field: "cnvs.cnv_change",
              value: ["Loss"],
            },
            op: "in",
          },
        ],
        ...filtersContent,
      ],
    },
  };
  const results: GraphQLApiResponse<any> = await graphqlAPI(
    dlMutatedGenesJSONQuery,
    graphQLFilters,
  );
  return results;
};

export interface DownloadMutatedGenes {
  readonly status: DataStatus;
  readonly genes: [];
  readonly error?: string;
}

const initialState: DownloadMutatedGenes = {
  status: "uninitialized",
  genes: [],
};

const slice = createSlice({
  name: "downloads",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMutatedGenesDownload.fulfilled, (state, action) => {
        if (action?.payload?.errors) {
          state = castDraft(initialState);
          state.status = "rejected";
          state.error = action.payload.errors.message;
        }
        const response = action.payload;
        state.status = "fulfilled";
        state.genes = response?.data?.explore?.genes;
        return state;
      })
      .addCase(fetchMutatedGenesDownload.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchMutatedGenesDownload.rejected, (state) => {
        state.status = "rejected";
        return state;
      });
  },
});

export const downloadsReducer = slice.reducer;
// export interface DownloadMutatedGenes

export const selectMutatedGenesJSON = (
  state: CoreState,
): CoreDataSelectorResponse<any> => state.genes;

export const selectDownloadsData = (
  state: CoreState,
): CoreDataSelectorResponse<{}> => {
  return {
    data: state.downloads.json.genes,
    status: state.downloads.json.status,
    error: state.downloads.json.error,
  };
};

export const useDownloadData = createUseCoreDataHook(
  fetchMutatedGenesDownload,
  selectDownloadsData,
);
