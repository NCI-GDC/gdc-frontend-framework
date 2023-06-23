import { GDC_API } from "../../constants";
import { graphqlAPI, GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import { buildCohortGqlOperator, FilterSet } from "../cohort";
import { GqlIntersection, GqlOperation, GqlUnion } from "../gdcapi/filters";

export interface ImageMetadataResponse {
  readonly Format: string;
  readonly Height: string;
  readonly Width: string;
  readonly Overlap: string;
  readonly TileSize: string;
  readonly uuid: string;
}

export const fetchSlideImages = async (
  file_id: string,
): Promise<ImageMetadataResponse> => {
  const response = await fetch(`${GDC_API}/tile/metadata/${file_id}`);

  if (response.ok) {
    return response.json();
  }

  throw Error(await response.text());
};

const imageViewerGraphlQLQuery = `
  query ImageViewer_relayQuery(
    $filters: FiltersArgument
    $slideFilter: FiltersArgument
    $cases_size: Int
    $cases_offset: Int
  ) {
    viewer {
      repository {
        cases {
          hits(
            case_filters: $filters
            first: $cases_size
            offset: $cases_offset
          ) {
            total
            edges {
              cursor
              node {
                id
                case_id
                submitter_id
                project {
                  project_id
                }
                files {
                  hits(filters: $slideFilter, first: 99) {
                    edges {
                      node {
                        file_id
                        submitter_id
                      }
                    }
                  }
                }
                samples {
                  hits(first: 99) {
                    edges {
                      node {
                        portions {
                          hits(first: 99) {
                            edges {
                              node {
                                slides {
                                  hits(first: 99) {
                                    edges {
                                      node {
                                        submitter_id
                                        slide_id
                                        percent_tumor_nuclei
                                        percent_monocyte_infiltration
                                        percent_normal_cells
                                        percent_stromal_cells
                                        percent_eosinophil_infiltration
                                        percent_lymphocyte_infiltration
                                        percent_neutrophil_infiltration
                                        section_location
                                        percent_granulocyte_infiltration
                                        percent_necrosis
                                        percent_inflam_infiltration
                                        number_proliferating_cells
                                        percent_tumor_cells
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
}`;

export interface queryParams {
  cases_offset: number;
  searchValues: Array<string>;
  case_id: string;
  caseFilters?: FilterSet;
}

export const fetchImageViewerQuery = async (
  params: queryParams,
): Promise<GraphQLApiResponse> => {
  const { cases_offset, searchValues, case_id, caseFilters } = params;

  let graphQLFilters = {
    slideFilter: {
      op: "and",
      content: [
        {
          op: "in",
          content: {
            field: "files.data_type",
            value: ["Slide Image"],
          },
        },
        {
          op: "in",
          content: {
            field: "files.access",
            value: ["open"],
          },
        },
      ],
    },
    // caseFilters
    filters: {
      op: "and",
      content: [
        {
          op: "in",
          content: {
            field: "summary.experimental_strategies.experimental_strategy",
            value: ["Tissue Slide", "Diagnostic Slide"],
          },
        },
      ] as GqlOperation[],
    },
  };

  if (case_id) {
    graphQLFilters = {
      ...graphQLFilters,
      filters: {
        ...graphQLFilters.filters,
        content: [
          ...graphQLFilters.filters.content,
          {
            op: "in",
            content: {
              field: "cases.case_id",
              value: [case_id],
            },
          },
        ],
      },
    };
  }

  if (searchValues.length > 0) {
    graphQLFilters = {
      ...graphQLFilters,
      filters: {
        ...graphQLFilters.filters,
        content: [
          ...graphQLFilters.filters.content,
          {
            op: "in",
            content: {
              field: "cases.submitter_id",
              value: searchValues,
            },
          },
        ],
      },
    };
  }

  if (caseFilters) {
    const caseGQL = buildCohortGqlOperator(caseFilters) as
      | GqlIntersection
      | GqlUnion
      | undefined;
    if (caseGQL) {
      graphQLFilters = {
        ...graphQLFilters,
        filters: {
          ...graphQLFilters.filters,
          content: [...graphQLFilters.filters.content, ...caseGQL.content],
        },
      };
    }
  }

  const results: GraphQLApiResponse<any> = await graphqlAPI(
    imageViewerGraphlQLQuery,
    { ...graphQLFilters, cases_size: 10, cases_offset },
  );

  return results;
};
