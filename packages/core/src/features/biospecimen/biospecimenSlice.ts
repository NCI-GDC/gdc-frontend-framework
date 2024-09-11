import { graphqlAPISlice } from "../gdcapi/gdcgraphql";
import { SampleNode } from "./types";

const bioSpecimenGraphQLQuery = `
query Biospecimen(
    $filters: FiltersArgument
    $fileFilters: FiltersArgument
  ) {
    viewer {
      repository {
        cases {
          hits(first: 1, case_filters: $filters) {
            edges {
              node {
                case_id
                submitter_id
                project {
                  project_id
                }
                files {
                  hits(first: 99, filters: $fileFilters) {
                    edges {
                      node {
                        file_name
                        file_size
                        data_format
                        file_id
                        md5sum
                        acl
                        state
                        access
                        submitter_id
                        data_category
                        data_type
                        type
                      }
                    }
                  }
                }
                samples {
                  hits(first: 99) {
                    total
                    edges {
                      node {
                        submitter_id
                        sample_id
                        tissue_type
                        tumor_code
                        tumor_code_id
                        oct_embedded
                        shortest_dimension
                        intermediate_dimension
                        longest_dimension
                        is_ffpe
                        pathology_report_uuid
                        tumor_descriptor
                        current_weight
                        initial_weight
                        time_between_clamping_and_freezing
                        time_between_excision_and_freezing
                        days_to_sample_procurement
                        freezing_method
                        preservation_method
                        days_to_collection
                        specimen_type
                        portions {
                          hits(first: 99) {
                            total
                            edges {
                              node {
                                submitter_id
                                portion_id
                                portion_number
                                weight
                                is_ffpe
                                analytes {
                                  hits(first: 99) {
                                    total
                                    edges {
                                      node {
                                        submitter_id
                                        analyte_id
                                        analyte_type
                                        analyte_type_id
                                        well_number
                                        amount
                                        a260_a280_ratio
                                        concentration
                                        spectrophotometer_method
                                        aliquots {
                                          hits(first: 99) {
                                            total
                                            edges {
                                              node {
                                                submitter_id
                                                aliquot_id
                                                source_center
                                                amount
                                                concentration
                                                analyte_type
                                                analyte_type_id
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                                slides {
                                  hits(first: 99) {
                                    total
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

interface NodeType {
  hits: { edges: Array<{ node: SampleNode }> };
}

export interface BiospecimenResponse {
  readonly files: { hits: { edges: Array<{ node: any }> } };
  readonly samples: NodeType;
}

const biospecimenSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    biospecimenData: builder.query<BiospecimenResponse, string>({
      query: (caseId) => ({
        graphQLQuery: bioSpecimenGraphQLQuery,
        graphQLFilters: {
          fileFilters: {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "cases.case_id",
                  value: [caseId],
                },
              },
              {
                op: "in",
                content: {
                  field: "files.data_type",
                  value: ["Biospecimen Supplement", "Slide Image"],
                },
              },
            ],
          },
          filters: {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "cases.case_id",
                  value: [caseId],
                },
              },
            ],
          },
        },
      }),
      transformResponse: (response) => ({
        files:
          response?.data?.viewer?.repository?.cases?.hits?.edges?.[0]?.node
            ?.files,
        samples:
          response?.data?.viewer?.repository?.cases?.hits?.edges?.[0]?.node
            ?.samples,
      }),
    }),
  }),
});

export const { useBiospecimenDataQuery } = biospecimenSlice;
