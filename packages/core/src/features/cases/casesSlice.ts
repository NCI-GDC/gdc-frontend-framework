import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
} from "../../dataAccess";
import { CoreState } from "../../reducers";
import { graphqlAPI, GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import { castDraft } from "immer";

const caseGraphQlQuery = `
query RepoCasesTable_relayQuery(
  $cases_size: Int
  $cases_offset: Int
  $cases_sort: [Sort]
  $filters: FiltersArgument
  $score: String
) {
  viewer {
    repository {
      cases {
        hits(
          score: $score
          first: $cases_size
          offset: $cases_offset
          sort: $cases_sort
          filters: $filters
        ) {
          total
          edges {
            node {
              id
              case_id
              primary_site
              disease_type
              submitter_id
              project {
                project_id
                program {
                  name
                }
              }
              files {
                hits(first: 99) {
                  total
                  edges {
                    node {
                      file_id
                      access
                      acl
                      file_name
                      file_size
                      state
                      data_type
                    }
                  }
                }
              }
              annotations {
                hits(first: 99) {
                  total
                  edges {
                    node {
                      annotation_id
                    }
                  }
                }
              }
              demographic {
                gender
                ethnicity
                race
                days_to_death
                vital_status
              }
              diagnoses {
                hits(first: 99) {
                  edges {
                    node {
                      primary_diagnosis
                      age_at_diagnosis
                    }
                  }
                }
              }
              summary {
                data_categories {
                  file_count
                  data_category
                }
                experimental_strategies {
                  file_count
                  experimental_strategy
                }
                file_count
              }
            }
          }
        }
      }
    }
  }
}
`;

export interface casesGraphQlParams {
  filters: any;
  cases_size: number;
  cases_offset: number;
  score: string;
}

export const fetchCasesData = async ({
  filters,
  cases_size,
  cases_offset,
  score,
}: casesGraphQlParams): Promise<GraphQLApiResponse<CaseResponse>> => {
  const results: GraphQLApiResponse<CaseResponse> = await graphqlAPI(
    caseGraphQlQuery,
    {
      filters,
      cases_size,
      cases_offset,
      score,
    },
  );

  return results;
};

export interface CaseResponse {
  viewer: {
    repository: {
      cases: {
        hits: {
          edges: Array<{
            node: {
              annotations: {
                hits: {
                  edges: Array<{
                    node: {
                      annotation_id: string;
                    };
                  }>;
                  total: number;
                };
              };
              case_id: string;
              demographic: {
                days_to_death: number | null;
                gender: null | string;
                ethnicity: null | string;
                race: null | string;
                vital_status: null | string;
              };
              diagnoses: {
                hits: {
                  edges: Array<{
                    node: {
                      primary_diagnosis: string | null;
                      age_at_diagnosis: number | null;
                    };
                  }>;
                };
              };
              files: {
                hits: {
                  edges: Array<{
                    node: {
                      access: "open" | "controlled";
                      acl: string[];
                      file_id: string;
                      file_size: number;
                      state: string;
                      file_name: string;
                      data_type: string;
                    };
                  }>;
                };
              };
              disease_type: string;
              id: string;
              primary_site: string;
              project: {
                program: {
                  name: string;
                };
                project_id: string;
              };
              submitter_id: string;
              summary: {
                data_categories: Array<{
                  data_category: string;
                  file_count: number;
                }>;
                experimental_strategies: Array<{
                  experimental_strategy: string;
                  file_count: number;
                }>;
                file_count: number;
              };
            };
          }>;
        };
      };
    };
  };
}

export const fetchQlCases = createAsyncThunk(
  "cases/fetchQlCases",
  async (
    params: casesGraphQlParams,
  ): Promise<GraphQLApiResponse<CaseResponse>> => {
    return await fetchCasesData(params);
  },
);

interface trial {
  case_id: string;
  case_uuid: string;
  project_id: string;
  program: string;
  primary_site: string;
  disease_type: string;
  primary_diagnosis: string | null;
  age_at_diagnosis: number | null;
  vital_status: string | null;
  days_to_death: number | null;
  gender: string | null;
  race: string | null;
  ethnicity: string | null;
  files: {
    access: "open" | "controlled";
    acl: string[];
    file_id: string;
    file_size: number;
    state: string;
    file_name: string;
    data_type: string;
  }[];
  filesCount: number;
  data_categories: Array<{
    data_category: string;
    file_count: number;
  }>;
  experimental_strategies: Array<{
    experimental_strategy: string;
    file_count: number;
  }>;
  annotations: {
    total: number;
    annotation_id: string;
  };
}
export interface CasesState {
  readonly casesData: CoreDataSelectorResponse<ReadonlyArray<trial>>;
  readonly totalSelectedCases?: number;
}

const initialState: CasesState = {
  casesData: {
    status: "uninitialized",
  },
};

const slice = createSlice({
  name: "cases",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQlCases.fulfilled, (state, action) => {
        const edges =
          action.payload.data?.viewer?.repository?.cases?.hits?.edges;
        const map = edges.map(({ node }) => ({
          case_id: node.submitter_id,
          case_uuid: node.case_id,
          project_id: node.project.project_id,
          program: node.project.program.name,
          primary_site: node.primary_site,
          disease_type: node.disease_type,
          primary_diagnosis:
            node.diagnoses.hits.edges?.[0]?.node?.primary_diagnosis,
          age_at_diagnosis:
            node.diagnoses.hits.edges?.[0]?.node?.age_at_diagnosis,
          vital_status: node.demographic.vital_status,
          days_to_death: node.demographic.days_to_death,
          gender: node.demographic.gender,
          race: node.demographic.race,
          ethnicity: node.demographic.ethnicity,
          filesCount: node.summary.file_count,
          data_categories: node.summary.data_categories,
          experimental_strategies: node.summary.experimental_strategies,
          annotations: {
            total: node.annotations?.hits?.total,
            annotation_id:
              node.annotations?.hits?.edges?.[0].node.annotation_id,
          },
          files: node.files.hits.edges.map(({ node }) => ({
            file_id: node.file_id,
            file_name: node.file_name,
            file_size: node.file_size,
            access: node.access,
            state: node.state,
            acl: node.acl,
            data_type: node.data_type,
          })),
        }));
        state.casesData.data = castDraft(map);
        state.casesData.status = "fulfilled";
        console.log({ edges });
      })
      .addCase(fetchQlCases.pending, (state) => {
        state.casesData = {
          status: "pending",
        };
        return state;
      })
      .addCase(fetchQlCases.rejected, (state, action) => {
        state.casesData = {
          status: "rejected",
        };
        if (action.error) {
          state.casesData.error = action.error.message;
        }

        return state;
      });
  },
});

export const casesReducer = slice.reducer;

export const selectCasesData = (
  state: CoreState,
): CoreDataSelectorResponse<ReadonlyArray<trial>> => {
  return state.cases.casesData;
};

export const useQlCases = createUseCoreDataHook(fetchQlCases, selectCasesData);
