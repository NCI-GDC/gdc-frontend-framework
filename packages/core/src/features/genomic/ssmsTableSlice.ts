import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseFiltersCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { castDraft } from "immer";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import {
  GraphQLApiResponse,
  graphqlAPI,
  TablePageOffsetProps,
} from "../gdcapi/gdcgraphql";
import {
  selectGenomicAndCohortFilters,
  selectGenomicAndCohortGqlFilters,
} from "./genomicFilters";
import {
  buildCohortGqlOperator,
  filterSetToOperation,
  selectCurrentCohortFilters,
} from "../cohort";
import {
  convertFilterToGqlFilter,
  Intersection,
  Union,
} from "../gdcapi/filters";
import { appendFilterToOperation } from "./utils";

const SSMSTableGraphQLQuery = `query SsmsTable_relayQuery(
  $ssmTested: FiltersArgument
$ssmCaseFilter: FiltersArgument
$ssmsTable_size: Int
$consequenceFilters: FiltersArgument
$ssmsTable_offset: Int
$ssmsTable_filters: FiltersArgument
$score: String
$sort: [Sort]
) {
  viewer {
    explore {
      cases {
        hits(first: 0, filters: $ssmTested) {
          total
        }
      }
      filteredCases: cases {
        hits(first: 0, filters: $ssmCaseFilter) {
          total
        }
      }
      ssms {
        hits(first: $ssmsTable_size, offset: $ssmsTable_offset, filters: $ssmsTable_filters, score: $score, sort: $sort) {
          total
          edges {
            node {
              id
              score
              genomic_dna_change
              mutation_subtype
              ssm_id
              consequence {
                hits(first: 1, filters: $consequenceFilters) {
                  edges {
                    node {
                      transcript {
                        is_canonical
                        annotation {
                          vep_impact
                          polyphen_impact
                          polyphen_score
                          sift_score
                          sift_impact
                        }
                        consequence_type
                        gene {
                          gene_id
                          symbol
                        }
                        aa_change
                      }
                      id
                    }
                  }
                }
              }
              filteredOccurences: occurrence {
                hits(first: 0, filters: $ssmCaseFilter) {
                  total
                }
              }
              occurrence {
                hits(first: 0, filters: $ssmTested) {
                  total
                }
              }
            }
          }
        }
      }
    }
  }
}`;

export interface SSMSConsequence {
  readonly id: string;
  readonly aa_change: string;
  readonly annotation: {
    readonly polyphen_impact: string;
    readonly polyphen_score: number;
    readonly shift_impact: string;
    readonly sift_score: string;
    readonly vep_impact: string;
  };
  consequence_type: string;
  readonly gene: {
    readonly gene_id: string;
    readonly symbol: string;
  };
  readonly is_canonical: boolean;
}
export interface SSMSData {
  readonly ssm_id: string;
  readonly occurrence: number;
  readonly filteredOccurrences: number;
  readonly id: string;
  readonly score: number;
  readonly genomic_dna_change: string;
  readonly mutation_subtype: string;
  readonly consequence: ReadonlyArray<SSMSConsequence>;
}

export interface GDCSsmsTable {
  readonly cases: number;
  readonly filteredCases: number;
  readonly ssmsTotal: number;
  readonly ssms: ReadonlyArray<SSMSData>;
  readonly pageSize: number;
  readonly offset: number;
}

export const buildSSMSTableSearchFilters = (
  term?: string,
): Union | undefined => {
  if (term !== undefined) {
    return {
      operator: "or",
      operands: [
        {
          operator: "includes",
          field: "ssms.genomic_dna_change",
          operands: [`*${term}*`],
        },
        {
          operator: "includes",
          field: "ssms.gene_aa_change",
          operands: [`*${term}*`],
        },
      ],
    };
  }
  return undefined;
};

export const fetchSsmsTable = createAsyncThunk<
  GraphQLApiResponse,
  TablePageOffsetProps,
  { dispatch: CoreDispatch; state: CoreState }
>(
  "genomic/ssmsTable",
  async (
    { pageSize, offset, searchTerm }: TablePageOffsetProps,
    thunkAPI,
  ): Promise<GraphQLApiResponse> => {
    const cohortFilters = buildCohortGqlOperator(
      selectCurrentCohortFilters(thunkAPI.getState()),
    );
    const cohortFiltersContent = cohortFilters?.content
      ? Object(cohortFilters?.content)
      : [];

    const geneAndCohortFilters = selectGenomicAndCohortFilters(
      thunkAPI.getState(),
    );

    const searchFilters = buildSSMSTableSearchFilters(searchTerm);
    const tableFilters = convertFilterToGqlFilter(
      appendFilterToOperation(
        filterSetToOperation(geneAndCohortFilters) as
          | Union
          | Intersection
          | undefined,
        searchFilters,
      ),
    );

    const graphQlFilters = {
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
      ssmCaseFilter: {
        content: [
          ...[
            {
              content: {
                field: "available_variation_data",
                value: ["ssm"],
              },
              op: "in",
            },
          ],
          ...cohortFiltersContent,
        ],
        op: "and",
      },
      ssmsTable_size: pageSize,
      consequenceFilters: {
        content: [
          {
            content: {
              field: "consequence.transcript.is_canonical",
              value: ["true"],
            },
            op: "in",
          },
        ],
        op: "and",
      },
      ssmsTable_offset: offset,
      ssmsTable_filters: tableFilters ? tableFilters : {},
      score: "occurrence.case.project.project_id",
      sort: [
        {
          field: "_score",
          order: "desc",
        },
        {
          field: "_uid",
          order: "asc",
        },
      ],
    };

    return await graphqlAPI(SSMSTableGraphQLQuery, graphQlFilters);
  },
);

export interface SsmsTableState {
  readonly ssms: GDCSsmsTable;
  readonly status: DataStatus;
  readonly error?: string;
}

const initialState: SsmsTableState = {
  ssms: {
    cases: 0,
    filteredCases: 0,
    ssmsTotal: 0,
    ssms: [],
    pageSize: 0,
    offset: 0,
  },
  status: "uninitialized",
};

const slice = createSlice({
  name: "ssmsTable",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSsmsTable.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.errors) {
          state = castDraft(initialState);
          state.status = "rejected";
          state.error = response.errors.filters;
        }
        const data = action.payload.data.viewer.explore;
        state.ssms.ssmsTotal = data.ssms.hits.total;
        state.ssms.cases = data.cases.hits.total;
        state.ssms.filteredCases = data.filteredCases.hits.total;
        state.ssms.ssms = data.ssms.hits.edges.map(
          ({ node }: Record<any, any>): SSMSData => {
            return {
              ssm_id: node.ssm_id,
              score: node.score,
              id: node.id,
              mutation_subtype: node.mutation_subtype,
              genomic_dna_change: node.genomic_dna_change,
              occurrence: node.occurrence.hits.total,
              filteredOccurrences: node.filteredOccurences.hits.total,
              consequence: node.consequence.hits.edges.map(
                (y: Record<any, any>) => {
                  const transcript = y.node.transcript;
                  return {
                    id: y.node.id,
                    is_canonical: transcript.is_canonical,
                    aa_change: transcript.aa_change,
                    consequence_type: transcript.consequence_type,
                    annotation: { ...transcript.annotation },
                    gene: { ...transcript.gene },
                  };
                },
              ),
            };
          },
        );

        state.status = "fulfilled";
        state.error = undefined;
        return state;
      })
      .addCase(fetchSsmsTable.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchSsmsTable.rejected, (state, action) => {
        state.status = "rejected";
        if (action.error) {
          state.error = action.error.message;
        }
        return state;
      });
  },
});

export const ssmsTableReducer = slice.reducer;

export const selectSsmsTableState = (state: CoreState): GDCSsmsTable =>
  state.genomic.ssmsTable.ssms;

export const selectSsmsTableData = (
  state: CoreState,
): CoreDataSelectorResponse<SsmsTableState> => {
  return {
    data: state.genomic.ssmsTable,
    status: state.genomic.ssmsTable.status,
    error: state.genomic.ssmsTable.error,
  };
};

export const useSsmsTable = createUseFiltersCoreDataHook(
  fetchSsmsTable,
  selectSsmsTableData,
  selectGenomicAndCohortGqlFilters,
);
