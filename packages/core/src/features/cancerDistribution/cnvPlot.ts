import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { castDraft } from "immer";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { CoreState } from "../../reducers";
import { buildCohortGqlOperator, FilterSet } from "../cohort";
import { GqlIntersection, Includes } from "../gdcapi/filters";
import { GraphQLApiResponse, graphqlAPI } from "../gdcapi/gdcgraphql";

const graphQLQuery = `query CancerDistributionCNV(
  $cnvAll: FiltersArgument,
  $cnvGain: FiltersArgument,
  $cnvLoss: FiltersArgument,
  $cnvTested: FiltersArgument,
  $cnvTestedByGene: FiltersArgument
  ) {
  viewer {
    explore {
      cases {
        cnvAll: hits(filters: $cnvAll) {
          total
        }
        gain: aggregations(filters: $cnvGain) {
          project__project_id {
            buckets {
              doc_count
              key
            }
          }
        }
        loss: aggregations(filters: $cnvLoss) {
          project__project_id {
            buckets {
              doc_count
              key
            }
          }
        }
        cnvTotal: aggregations(filters: $cnvTested) {
          project__project_id {
            buckets {
              doc_count
              key
            }
          }
        }
        cnvTestedByGene: hits(filters: $cnvTestedByGene) {
          total
        }
      }
    }
  }
}
`;

const fetchCnvAnalysisQuery = async (
  gene: string,
  contextFilters: FilterSet | undefined,
): Promise<GraphQLApiResponse> => {
  const contextGene =
    ((contextFilters?.root["genes.gene_id"] as Includes)
      ?.operands as string[]) ?? [];
  const contextWithGene = {
    mode: "and",
    root: {
      ...contextFilters?.root,
      ["genes.gene_id"]: {
        operator: "includes",
        field: "genes.gene_id",
        operands: [gene, ...contextGene],
      } as Includes,
    },
  };

  const gqlContextFilter = buildCohortGqlOperator(contextWithGene);
  const graphQLFilters = {
    cnvAll: {
      op: "and",
      content: [
        {
          op: "in",
          content: {
            field: "cases.available_variation_data",
            value: ["cnv"],
          },
        },
        {
          op: "in",
          content: {
            field: "cnvs.cnv_change",
            value: ["Gain", "Loss"],
          },
        },
        ...(gqlContextFilter
          ? (gqlContextFilter as GqlIntersection)?.content
          : []),
      ],
    },
    cnvGain: {
      op: "and",
      content: [
        {
          op: "in",
          content: {
            field: "cases.available_variation_data",
            value: ["cnv"],
          },
        },
        {
          op: "in",
          content: {
            field: "cnvs.cnv_change",
            value: ["Gain"],
          },
        },
        ...(gqlContextFilter
          ? (gqlContextFilter as GqlIntersection)?.content
          : []),
      ],
    },
    cnvLoss: {
      op: "and",
      content: [
        {
          op: "in",
          content: {
            field: "cases.available_variation_data",
            value: ["cnv"],
          },
        },
        {
          op: "in",
          content: {
            field: "cnvs.cnv_change",
            value: ["Loss"],
          },
        },
        ...(gqlContextFilter
          ? (gqlContextFilter as GqlIntersection)?.content
          : []),
      ],
    },
    cnvTested: {
      op: "and",
      content: [
        {
          op: "in",
          content: {
            field: "cases.available_variation_data",
            value: ["cnv"],
          },
        },
      ],
    },
    cnvTestedByGene: {
      op: "and",
      content: [
        {
          op: "in",
          content: {
            field: "cases.available_variation_data",
            value: ["cnv"],
          },
        },
        ...(gqlContextFilter
          ? (gqlContextFilter as GqlIntersection)?.content
          : []),
      ],
    },
  };

  const results: GraphQLApiResponse<any> = await graphqlAPI(
    graphQLQuery,
    graphQLFilters,
  );

  return results;
};

export const fetchCnvPlot = createAsyncThunk(
  "cancerDistribution/cnvPlot",
  async ({
    gene,
    contextFilters,
  }: {
    gene: string;
    contextFilters: FilterSet | undefined;
  }): Promise<GraphQLApiResponse> => {
    return await fetchCnvAnalysisQuery(gene, contextFilters);
  },
);

interface CNVPlotPoint {
  readonly project: string;
  readonly gain: number;
  readonly loss: number;
  readonly total: number;
}

interface CNVData {
  readonly cases: CNVPlotPoint[];
  readonly caseTotal: number;
  readonly mutationTotal: number;
}

export interface CnvPlotState {
  readonly cnv: CNVData;
  readonly status: DataStatus;
  readonly error?: string;
}

const initialState: CnvPlotState = {
  cnv: { cases: [], caseTotal: 0, mutationTotal: 0 },
  status: "uninitialized",
};

interface GraphQLDoc {
  readonly key: string;
  readonly doc_count: number;
}

const slice = createSlice({
  name: "cancerDistribution/cnvPlot",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCnvPlot.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.errors) {
          state = castDraft(initialState);
          state.status = "rejected";
          state.error = response.errors.message;
        }

        const gain: CNVPlotPoint[] =
          response?.data?.viewer?.explore?.cases?.gain?.project__project_id?.buckets.map(
            (doc: GraphQLDoc) => ({ gain: doc.doc_count, project: doc.key }),
          ) || [];
        const loss: CNVPlotPoint[] =
          response?.data?.viewer?.explore?.cases?.loss?.project__project_id?.buckets.map(
            (doc: GraphQLDoc) => ({ loss: doc.doc_count, project: doc.key }),
          ) || [];
        const total: CNVPlotPoint[] =
          response?.data?.viewer?.explore?.cases?.cnvTotal?.project__project_id?.buckets.map(
            (doc: GraphQLDoc) => ({ total: doc.doc_count, project: doc.key }),
          );

        const merged = total.map((doc) => ({
          ...doc,
          ...gain.find((gain) => gain.project === doc.project),
          ...loss.find((loss) => loss.project === doc.project),
        }));
        state = {
          cnv: {
            cases: merged,
            mutationTotal:
              response?.data?.viewer?.explore?.cases?.cnvAll?.total,
            caseTotal:
              response?.data?.viewer?.explore?.cases.cnvTestedByGene?.total,
          },
          status: "fulfilled",
        };
        return state;
      })
      .addCase(fetchCnvPlot.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchCnvPlot.rejected, (state, action) => {
        state.status = "rejected";
        if (action.error) {
          state.error = action.error.message;
        }
        return state;
      });
  },
});

export const cnvPlotReducer = slice.reducer;

export const selectCnvPlotData = (
  state: CoreState,
): CoreDataSelectorResponse<CNVData> => {
  return {
    data: state.cancerDistribution.cnvPlot.cnv,
    status: state.cancerDistribution.cnvPlot.status,
    error: state.cancerDistribution.cnvPlot.error,
  };
};

export const useCnvPlot = createUseCoreDataHook(
  fetchCnvPlot,
  selectCnvPlotData,
);
