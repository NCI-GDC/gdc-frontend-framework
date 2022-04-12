import { graphqlAPI, GraphQLApiResponse } from "../gdcapi/gdcgraphql";

export interface ImageMetadataResponse {
  readonly Format: string;
  readonly Height: string;
  readonly Width: string;
  readonly Overlap: string;
  readonly TileSize: string;
  readonly uuid: string;
}

export const fetchSlideImages = async (
  fileId: string,
): Promise<ImageMetadataResponse> => {
  const response = await fetch(
    `https://api.gdc.cancer.gov/tile/metadata/${fileId}`,
  );

  if (response.ok) {
    return response.json();
  }

  throw Error(await response.text());
};

const graphQLFilters = {
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
    ],
  },
};

const imageViewerGraphlQLQuery = `
  query ImageViewer_relayQuery(
    $filters: FiltersArgument
    $slideFilter: FiltersArgument
  ) {
    viewer {
      repository {
        cases {
          hits(
            filters: $filters
            first: 10
            offset: 0
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

export const fetchImageViewerQuery = async (): Promise<GraphQLApiResponse> => {
  const results: GraphQLApiResponse<any> = await graphqlAPI(
    imageViewerGraphlQLQuery,
    graphQLFilters,
  );

  return results;
};
