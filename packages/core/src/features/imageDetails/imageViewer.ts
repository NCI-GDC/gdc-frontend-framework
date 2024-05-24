import { buildCohortGqlOperator, FilterSet } from "../cohort";
import { GqlIntersection, GqlOperation, GqlUnion } from "../gdcapi/filters";
import { graphqlAPISlice } from "../gdcapi/gdcgraphql";
import { trimEnd, find } from "lodash";
import { caseNodeType } from "./types";

const imageViewerGraphlQLQuery = `
  query ImageViewer(
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

export const getSlides: (caseNode: caseNodeType) => any[] = (
  caseNode: caseNodeType,
) => {
  const portions = (
    caseNode.samples || {
      hits: { edges: [] },
    }
  ).hits.edges.reduce(
    (acc: any, { node }: any) => [
      ...acc,
      ...node.portions.hits.edges.map((p: { node: any }) => p.node),
    ],
    [],
  );

  const slideImageIds = caseNode.files.hits.edges.map(
    ({ node }: { node: { file_id: string; submitter_id: string } }) => ({
      file_id: node.file_id,
      submitter_id: trimEnd(node.submitter_id, "_slide_image"),
    }),
  );

  const slides = portions.reduce(
    (acc: any, { slides }: any) => [
      ...acc,
      ...slides.hits.edges.map((p: { node: any }) => p.node),
    ],
    [],
  );

  return slideImageIds.map((id: { submitter_id: any }) => {
    const matchBySubmitter = find(slides, { submitter_id: id.submitter_id });
    return { ...id, ...matchBySubmitter };
  });
};

interface ImageViewerQueryParams {
  cases_offset: number;
  searchValues: Array<string>;
  case_id: string;
  caseFilters?: FilterSet;
}

interface ImageViewerReponse {
  readonly total: number;
  readonly edges: Record<string, any[]>;
}

const imageViewerSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    imageViewer: builder.query<ImageViewerReponse, ImageViewerQueryParams>({
      query: ({ cases_offset, searchValues, case_id, caseFilters }) => {
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
                  field:
                    "summary.experimental_strategies.experimental_strategy",
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
                content: [
                  ...graphQLFilters.filters.content,
                  ...caseGQL.content,
                ],
              },
            };
          }
        }

        return {
          graphQLQuery: imageViewerGraphlQLQuery,
          graphQLFilters: { ...graphQLFilters, cases_size: 10, cases_offset },
        };
      },
      transformResponse: (response) => {
        const hits = response?.data?.viewer?.repository?.cases?.hits;

        const obj = Object.fromEntries(
          hits?.edges?.map((edge: any) => {
            const parsedSlideImagesInfo = getSlides(edge?.node);
            const caseSubmitterId = edge?.node?.submitter_id;
            const projectID = edge?.node?.project?.project_id;

            return [`${caseSubmitterId} - ${projectID}`, parsedSlideImagesInfo];
          }),
        );

        return {
          total: hits?.total,
          edges: obj,
        };
      },
    }),
  }),
});

export const { useImageViewerQuery } = imageViewerSlice;
