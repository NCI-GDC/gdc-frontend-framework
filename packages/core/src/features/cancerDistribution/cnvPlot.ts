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
  $caseFilters: FiltersArgument,
  $cnvAll: FiltersArgument,
  $cnvGain: FiltersArgument,
  $cnvLoss: FiltersArgument,
  $cnvTested: FiltersArgument,
  $cnvTestedByGene: FiltersArgument
  ) {
  viewer {
    explore {
      cases {
        cnvAll: hits(case_filters: $caseFilters,  filters: $cnvAll) {
          total
        }
        gain: aggregations(case_filters: $caseFilters, filters: $cnvGain) {
          project__project_id {
            buckets {
              doc_count
              key
            }
          }
        }
        loss: aggregations(case_filters: $caseFilters, filters: $cnvLoss) {
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
        cnvTestedByGene: hits(case_filters: $caseFilters, filters: $cnvTestedByGene) {
          total
        }
      }
    }
  }
}
`;

const fetchCnvAnalysisQuery = async (
  gene: string,
  cphortFilters: FilterSet | undefined,
  genomicFilters: FilterSet | undefined,
): Promise<GraphQLApiResponse> => {
  const contextGene =
    ((genomicFilters?.root["genes.gene_id"] as Includes)
      ?.operands as string[]) ?? [];
  const contextWithGene = {
    mode: "and",
    root: {
      ...genomicFilters?.root,
      ["genes.gene_id"]: {
        operator: "includes",
        field: "genes.gene_id",
        operands: [gene, ...contextGene],
      } as Includes,
    },
  };

  const caseFilters = buildCohortGqlOperator(cphortFilters);
  const gqlContextFilter = buildCohortGqlOperator(contextWithGene);
  const gqlContextIntersection =
    gqlContextFilter && (gqlContextFilter as GqlIntersection).content
      ? (gqlContextFilter as GqlIntersection).content
      : [];
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
        ...gqlContextIntersection,
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
        ...gqlContextIntersection,
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
        ...gqlContextIntersection,
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
        ...gqlContextIntersection,
      ],
    },
    caseFilters: caseFilters,
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
    cohortFilters,
    genomicFilters,
  }: {
    gene: string;
    cohortFilters: FilterSet | undefined;
    genomicFilters: FilterSet | undefined;
  }): Promise<GraphQLApiResponse> => {
    return await fetchCnvAnalysisQuery(gene, cohortFilters, genomicFilters);
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
  readonly requestId?: string;
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
        if (state.requestId != action.meta.requestId) return state;
        const response = action.payload;
        if (response.errors) {
          state = castDraft(initialState);
          state.status = "rejected";
          state.error = response.errors.message;
          return state;
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
      .addCase(fetchCnvPlot.pending, (state, action) => {
        state.status = "pending";
        state.requestId = action.meta.requestId;
        return state;
      })
      .addCase(fetchCnvPlot.rejected, (state, action) => {
        if (state.requestId != action.meta.requestId) return state;
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
