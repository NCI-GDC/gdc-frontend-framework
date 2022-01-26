import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CoreDataSelectorResponse, createUseCoreDataHook, DataStatus } from "../../dataAcess";
import { castDraft } from "immer";
import { CoreDispatch, CoreState } from "../../store";



export interface GraphQLFetchError {
  readonly url: string;
  readonly status: number;
  readonly statusText: string;
  readonly text: string;
  readonly variables?: Record<string, any>;
}

const buildGraphQLFetchError = async (
  res: Response,
  variables?: Record<string, any>,
): Promise<GraphQLFetchError> => {
  return {
    url: res.url,
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
    variables: variables,
  };
};

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

export type AnyJson = Record<string, any>;

export interface GraphQLApiResponse<H = AnyJson> {
  readonly data: H;
  readonly warnings: Record<string, string>;
}


const graphqlAPI = async <T>(query: string, variables: Record<string, any>): Promise<GraphQLApiResponse<T>> => {
  const res = await fetch("https://api.gdc.cancer.gov/v0/graphql", {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (res.ok)
    return res.json();

  throw await buildGraphQLFetchError(res, variables);
};

export interface SSMSData {
  readonly ssm_id: string;
}

export interface GDCSsmsTable {
  readonly cases: number;
  readonly filteredCases: number;
  readonly ssmsTotal: number;
  readonly ssms: ReadonlyArray<SSMSData>;
  readonly pageSize: number;
  readonly offset: number;
}

interface SsmsTableRequest {
  readonly pageSize: number;
  readonly offset: number;
}

export const fetchSsmsTable = createAsyncThunk <
  GraphQLApiResponse,
  SsmsTableRequest,
  { dispatch: CoreDispatch; state: CoreState }
  > (
  "ssmsTable",
  async ({ pageSize, offset} : SsmsTableRequest): Promise<GraphQLApiResponse> => {
  const graphQlFilters = {
    "ssmTested": {
      "content": [
        {
          "content": {
            "field": "cases.available_variation_data",
            "value": [
              "ssm",
            ],
          },
            "op": "in"
          }
        ],
        "op": "and"
      },
      "ssmCaseFilter": {
        "content": [
          {
            "content": {
              "field": "available_variation_data",
              "value": [
                "ssm"
              ]
            },
            "op": "in"
          },
          {
            "op": "in",
            "content": {
              "field": "cases.primary_site",
              "value": [
                "breast"
              ]
            }
          },
          {
            "content": {
              "field": "genes.is_cancer_gene_census",
              "value": [
                "true"
              ]
            },
            "op": "in"
          }
        ],
        "op": "and"
      },
      "ssmsTable_size": pageSize,
      "consequenceFilters": {
        "content": [
          {
            "content": {
              "field": "consequence.transcript.is_canonical",
              "value": [
                "true"
              ]
            },
            "op": "in"
          }
        ],
        "op": "and"
      },
      "ssmsTable_offset": offset,
      "ssmsTable_filters": {
        "op": "and",
        "content": [
          {
            "op": "in",
            "content": {
              "field": "cases.primary_site",
              "value": [
                "breast"
              ]
            }
          },
          {
            "content": {
              "field": "genes.is_cancer_gene_census",
              "value": [
                "true"
              ]
            },
            "op": "in"
          }
        ]
      },
      "score": "occurrence.case.project.project_id",
      "sort": [
        {
          "field": "_score",
          "order": "desc"
        },
        {
          "field": "_uid",
          "order": "asc"
        }
      ]
    }

    return await graphqlAPI(SSMSTableGraphQLQuery, graphQlFilters);
  }
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
        if (response.warnings) {
          state = castDraft(initialState);
          state.status = "rejected";
          state.error = response.warnings.filters;
        }
        const data = action.payload.data.viewer.explore;
        state.ssms.cases = data.cases.hits.total;
        state.ssms.filteredCases = data.filteredCases.hits.total;
        state.ssms.ssms = data.ssms.hits.edges.map((x: Record<any, any>): SSMSData => {
          return {
            ssm_id: x.ssm_id,
          };
        });

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

export const selectSsmsTableState = (state: CoreState): GDCSsmsTable => state.ssmsTable.ssms;

export const selectSsmsTableData = (
  state: CoreState,
): CoreDataSelectorResponse<SsmsTableState> => {
  return {
    data: state.ssmsTable,
    status: state.ssmsTable.status,
    error: state.ssmsTable.error,
  };
};

export const useSsmsTable = createUseCoreDataHook(fetchSsmsTable, selectSsmsTableData);
