
import {
  createAsyncThunk,
  createSlice
} from "@reduxjs/toolkit";
import {  GdcApiResponse } from "../gdcapi/gdcapi";
import { CoreDataSelectorResponse, createUseCoreDataHook } from "../../dataAcess";
import { castDraft } from "immer";
import { fetchCases } from "../cases/casesSlice";
import { CoreState } from "../../store";


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


const graphqlAPI = async <T>( query:string, variables:Record<string, any> ) : Promise<GdcApiResponse<T>> =>  {
  const res = await fetch("https://api.gdc.cancer.gov/v0/graphql", {
  method: "POST",
  body: JSON.stringify({
    query,
    variables
  })});

  if (res.ok)
    return res.json();

  throw await buildGraphQLFetchError(res, variables);
};


interface SsmsTableRequest {
  readonly pagesize: number;
  readonly offset: number;
}

export const fetchSsmsTable = createAsyncThunk("ssmsTable", async (request: SsmsTableRequest) : Promise<GdcApiResponse<SsmsTableDefaults>> => {
    const graphQlFilters = {
      "ssmTested": {
        "content": [
          {
            "content": {
              "field": "cases.available_variation_data",
              "value": [
                "ssm"
              ]
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
      "ssmsTable_size": request.pagesize,
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
      "ssmsTable_offset": request.offset,
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

export interface SsmsTableDefaults {
  readonly caseTotal: number;
  readonly pageSize: number;
  readonly offset: number;
}

export interface SsmsTableState {
  readonly smsTableData: CoreDataSelectorResponse<SsmsTableDefaults>;
}


const initialState: SsmsTableState = {
  smsTableData: {
    status: "uninitialized",
  },
};


const slice = createSlice({
  name: "ssmsTable",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSsmsTable.fulfilled, (state, action) => {
        state.smsTableData.data = castDraft(action.payload.data);
        state.smsTableData.status = "fulfilled";
        state.smsTableData.error = undefined;
        return state;
      })
      .addCase(fetchCases.pending, (state) => {
        state.smsTableData = {
          status: "pending",
        };
        return state;
      })
      .addCase(fetchCases.rejected, (state, action) => {
        state.smsTableData = {
          status: "rejected",
        };
        if (action.error) {
          state.smsTableData.error = action.error.message;
        }

        return state;
      });
  },
});

export const ssmsableReducer = slice.reducer;

export const selectSsmsTableData = (
  state: CoreState,
): CoreDataSelectorResponse<SsmsTableDefaults> => {
  return state.ssmsTable.smsTableData;
};

export const useSsmsTable = createUseCoreDataHook(fetchSsmsTable, selectSsmsTableData);
