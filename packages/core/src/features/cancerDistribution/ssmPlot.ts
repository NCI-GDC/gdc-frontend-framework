import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { castDraft } from "immer";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { CoreState } from "../../reducers";
import { buildCohortGqlOperator, FilterSet } from "../cohort";
import { GqlIntersection } from "../gdcapi/filters";
import { GraphQLApiResponse, graphqlAPI } from "../gdcapi/gdcgraphql";

const graphqlQuery = `query CancerDistribution($caseAggsFilters: FiltersArgument, $ssmTested: FiltersArgument, $ssmFilters: FiltersArgument) {
  viewer {
    explore {
      ssms {
        hits(first: 0, filters: $ssmFilters) {
          total
        }
      }
      cases {
        ssmFiltered: aggregations(filters: $caseAggsFilters) {
          project__project_id {
            buckets {
              doc_count
              key
            }
          }
        },
        total: aggregations(filters: $ssmTested) {
          project__project_id {
            buckets {
              doc_count
              key
            }
          }
        }
      }
    }
  }
}
`;

const fetchSsmAnalysisQuery = async (
  gene: string,
  ssms: string,
  contextFilters: FilterSet | undefined,
) => {
  const gqlContextFilter = buildCohortGqlOperator(contextFilters);
  const gqlContextIntersection =
    gqlContextFilter && (gqlContextFilter as GqlIntersection).content
      ? (gqlContextFilter as GqlIntersection).content
      : [];
  const graphqlFilters = gene
    ? {
        caseAggsFilters: {
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
              op: "in",
              content: {
                field: "genes.gene_id",
                value: [gene],
              },
            },
            {
              op: "not",
              content: {
                field: "cases.gene.ssm.observation.observation_id",
                value: "MISSING",
              },
            },
            ...gqlContextIntersection,
          ],
        },
        ssmFilters: {
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
              op: "in",
              content: {
                field: "genes.gene_id",
                value: [gene],
              },
            },
            ...gqlContextIntersection,
          ],
        },
        ssmTested: {
          op: "and",
          content: [
            {
              op: "in",
              content: {
                field: "cases.available_variation_data",
                value: ["ssm"],
              },
            },
          ],
        },
      }
    : {
        caseAggsFilters: {
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
              op: "in",
              content: {
                field: "ssms.ssm_id",
                value: [ssms],
              },
            },
          ],
        },
        ssmTested: {
          op: "and",
          content: [
            {
              op: "in",
              content: {
                field: "cases.available_variation_data",
                value: ["ssm"],
              },
            },
          ],
        },
      };

  return (await graphqlAPI(graphqlQuery, graphqlFilters)) as GraphQLApiResponse<
    Record<string, any>
  >;
};

export const fetchSsmPlot = createAsyncThunk(
  "cancerDistribution/ssmPlot",
  async ({
    gene,
    ssms,
    contextFilters,
  }: {
    gene: string;
    ssms: string;
    contextFilters: FilterSet | undefined;
  }) => {
    return await fetchSsmAnalysisQuery(gene, ssms, contextFilters);
  },
);

interface SsmPlotPoint {
  readonly project: string;
  readonly ssmCount: number;
  readonly totalCount: number;
}

export interface SsmPlotData {
  readonly cases: SsmPlotPoint[];
  readonly ssmCount: number;
}

export interface SsmPlotState {
  readonly ssm: SsmPlotData;
  readonly status: DataStatus;
  readonly error?: string;
}

const initialState: SsmPlotState = {
  ssm: { cases: [], ssmCount: 0 },
  status: "uninitialized",
};

interface GraphQLDoc {
  readonly key: string;
  readonly doc_count: number;
}

const slice = createSlice({
  name: "cancerDistribution/ssmPlot",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSsmPlot.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.errors) {
          state = castDraft(initialState);
          state.status = "rejected";
          state.error = response.errors.message;
        }

        const ssm =
          response?.data?.viewer?.explore?.cases?.ssmFiltered?.project__project_id?.buckets.map(
            (d: GraphQLDoc) => ({ ssmCount: d.doc_count, project: d.key }),
          ) || [];
        const total =
          response?.data?.viewer?.explore?.cases?.total?.project__project_id?.buckets.map(
            (d: GraphQLDoc) => ({ totalCount: d.doc_count, project: d.key }),
          );

        const merged = ssm.map((d: SsmPlotPoint) => ({
          ...d,
          ...total.find((t: SsmPlotPoint) => t.project === d.project),
        }));
        state = {
          ssm: {
            cases: merged,
            ssmCount: response?.data?.viewer?.explore?.ssms?.hits?.total,
          },
          status: "fulfilled",
        };
        return state;
      })
      .addCase(fetchSsmPlot.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchSsmPlot.rejected, (state, action) => {
        state.status = "rejected";
        if (action.error) {
          state.error = action.error.message;
        }
        return state;
      });
  },
});

export const ssmPlotReducer = slice.reducer;

export const selectSsmPlotData = (
  state: CoreState,
): CoreDataSelectorResponse<SsmPlotData> => {
  return {
    data: state.cancerDistribution.ssmPlot.ssm,
    status: state.cancerDistribution.ssmPlot.status,
    error: state.cancerDistribution.ssmPlot.error,
  };
};

export const useSsmPlot = createUseCoreDataHook(
  fetchSsmPlot,
  selectSsmPlotData,
);
