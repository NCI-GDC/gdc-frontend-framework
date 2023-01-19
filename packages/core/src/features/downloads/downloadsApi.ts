import { GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import {
  CoreDataSelectorResponse,
  CoreDispatch,
  CoreState,
  createUseCoreDataHook,
  DataStatus,
  GqlOperation,
  graphqlAPI,
} from "@gff/core";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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
export const fetchMutatedGenesDownload = createAsyncThunk<
  GraphQLApiResponse,
  GqlOperation,
  { dispatch: CoreDispatch; state: CoreState }
>("mutatedGenes/fetchMutatedGenes", async (filters?: GqlOperation) => {
  const graphQlFilters = filters ? { filters: filters } : {};
  return await graphqlAPI(dlMutatedGenesJSONQuery, graphQlFilters);
});

export interface MutatedGeneDownload {
  data: any;
  status: DataStatus;
  error?: string;
}

const initialState: MutatedGeneDownload = {
  data: {
    genes: [],
  },
  status: "uninitialized",
};

const slice = createSlice({
  name: "fetchMutatedGenes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMutatedGenesDownload.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.errors) {
          state.status = "rejected";
        } else {
          state.data = {
            genes: response?.data?.explore?.genes,
          };
          state.status = "fulfilled";
        }
      })
      .addCase(fetchMutatedGenesDownload.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchMutatedGenesDownload.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

// interface GenomicTableDownloadProps extends TablePageOffsetProps {
//     totalCount: number;
// }

// export const fetchMutatedGenesDownload = createAsyncThunk(
//   "downloads/json",
//   async (queryParams: any): Promise<GraphQLApiResponse> => {
//     const { totalCount, genomicFilters } = queryParams;
//     return await fetchedMutatedGenesJSON(totalCount, genomicFilters);
//   },
// );

// export const fetchedMutatedGenesJSON = async (
//     totalCount: number,
//     genomicFilters: FilterSet,
// ): Promise<GraphQLApiResponse> => {
//     const filters = buildCohortGqlOperator(genomicFilters);
//     const filtersContent = filters?.content ? Object(filters?.content) : [];

//     // v1 behavior for offset
//     const graphQLFilters = {
//         genesTable_size: totalCount,
//         genesTable_offset: 0,
//         score: "case.project.project_id",
//         ssmCase: {
//             op: "and",
//             content: [
//                 {
//                     op: "in",
//                     content: {
//                         field: "cases.available_variation_data",
//                         value: ["ssm"],
//                     },
//                 },
//                 {
//                     op: "NOT",
//                     content: {
//                         field: "genes.case.ssm.observation.observation_id",
//                         value: "MISSING",
//                     },
//                 },
//             ],
//         },
//         geneCaseFilter: {
//             content: [
//                 ...[
//                     {
//                         content: {
//                             field: "cases.available_variation_data",
//                             value: ["ssm"],
//                         },
//                         op: "in",
//                     },
//                 ],
//                 ...filtersContent,
//             ],
//             op: "and",
//         },
//         ssmTested: {
//             content: [
//                 {
//                     content: {
//                         field: "cases.available_variation_data",
//                         value: ["ssm"],
//                     },
//                     op: "in",
//                 },
//             ],
//             op: "and",
//         },
//         cnvTested: {
//             op: "and",
//             content: [
//                 ...[
//                     {
//                         content: {
//                             field: "cases.available_variation_data",
//                             value: ["cnv"],
//                         },
//                         op: "in",
//                     },
//                 ],
//                 ...filtersContent,
//             ],
//         },
//         cnvGainFilters: {
//             op: "and",
//             content: [
//                 ...[
//                     {
//                         content: {
//                             field: "cases.available_variation_data",
//                             value: ["cnv"],
//                         },
//                         op: "in",
//                     },
//                     {
//                         content: {
//                             field: "cnvs.cnv_change",
//                             value: ["Gain"],
//                         },
//                         op: "in",
//                     },
//                 ],
//                 ...filtersContent,
//             ],
//         },
//         cnvLossFilters: {
//             op: "and",
//             content: [
//                 ...[
//                     {
//                         content: {
//                             field: "cases.available_variation_data",
//                             value: ["cnv"],
//                         },
//                         op: "in",
//                     },
//                     {
//                         content: {
//                             field: "cnvs.cnv_change",
//                             value: ["Loss"],
//                         },
//                         op: "in",
//                     },
//                 ],
//                 ...filtersContent,
//             ],
//         },
//     };
//     const results: GraphQLApiResponse<any> = await graphqlAPI(
//         dlMutatedGenesJSONQuery,
//         graphQLFilters,
//     );
//     return results;
// };

export const downloadsReducer = slice.reducer;

export interface MutatedGene {
  symbol: string;
  name: string;
  cytoband: string[];
  biotype: string;
  gene_id: string;
}

export interface MutatedGeneDlData {
  genes: Array<MutatedGene>;
}

export const selectMutatedGenesDownload = (
  state: CoreState,
): CoreDataSelectorResponse<MutatedGeneDlData> => {
  return {
    data: state.mutatedGenes.data,
    status: state.mutatedGenes.status,
  };
};

export const useMutatedGenes = createUseCoreDataHook(
  fetchMutatedGenesDownload,
  selectMutatedGenesDownload,
);
