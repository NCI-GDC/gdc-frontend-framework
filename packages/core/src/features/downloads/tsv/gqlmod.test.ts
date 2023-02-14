import {
  getVersion,
  getGQLParams,
  getAliasFilters,
  getAliasGraphQLQuery,
} from "./gqlmod";

describe("gql mod helper functions", () => {
  describe("returns correct gql filter version", () => {
    test("returns empty version", () => {
      const { filters, id } = getVersion("invalid version");
      expect(filters).toEqual("");
      expect(id).toEqual("");
    });
    test("returns genes version", () => {
      const { filters, id } = getVersion("genes");
      expect(filters).toEqual("$filters_genes");
      expect(id).toEqual("gene_id");
    });
    test("returns ssms version", () => {
      const { filters, id } = getVersion("ssms");
      expect(filters).toEqual("$filters_ssms");
      expect(id).toEqual("ssm_id");
    });
  });
  describe("returns correct gql query string params", () => {
    test("returns correct params for 3 gene ids", () => {
      const params = getGQLParams(["gene1", "gene2", "gene3"], "genes");
      const queryParams = [
        "$filters_case: FiltersArgument",
        "$filters_genes_gene1: FiltersArgument",
        "$filters_genes_gene2: FiltersArgument",
        "$filters_genes_gene3: FiltersArgument",
      ].join(",\r\n");
      expect(params).toEqual(queryParams);
    });
    test("returns correct params for 1 ssms id", () => {
      const params = getGQLParams(["ssms9"], "ssms");
      const queryParams = [
        "$filters_case: FiltersArgument",
        "$filters_ssms_ssms9: FiltersArgument",
      ].join(",\r\n");
      expect(params).toEqual(queryParams);
    });
  });
  describe("returns correct gql query string body", () => {
    test("returns correct body for 2 gene ids", () => {
      const params = getAliasGraphQLQuery(["gene1", "gene2", "gene3"], "genes");
      const queryBody = `
            query GenesQueryMod(${getGQLParams(
              ["gene1", "gene2", "gene3"],
              "genes",
            )}
            ) {
                explore {
                    cases {
                    denominators: aggregations(filters: $filters_case) {
                        project__project_id {
                            buckets {
                                key
                                doc_count
                            }
                        }
                    }
                    filters_genes_gene1 : aggregations(filters: $filters_genes_gene1) {
                        project__project_id {
                            buckets {
                                key
                                doc_count
                            }
                        }
                    }
                    filters_genes_gene2 : aggregations(filters: $filters_genes_gene2) {
                        project__project_id {
                            buckets {
                                key
                                doc_count
                            }
                        }
                    }
                    filters_genes_gene3 : aggregations(filters: $filters_genes_gene3) {
                        project__project_id {
                            buckets {
                                key
                                doc_count
                            }
                        }
                    }
                }
            }
        }`;
      expect(params).toBe(queryBody);
    });
    test("returns correct body for 1 ssms ids", () => {
      const params = getAliasGraphQLQuery(["ssms9"], "ssms");
      const queryBody = `
            query GenesQueryMod(${getGQLParams(["ssms9"], "ssms")}
            ) {
                explore {
                    cases {
                    denominators: aggregations(filters: $filters_case) {
                        project__project_id {
                            buckets {
                                key
                                doc_count
                            }
                        }
                    }
                    filters_ssms_gene9 : aggregations(filters: $filters_ssms_ssms9) {
                        project__project_id {
                            buckets {
                                key
                                doc_count
                            }
                        }
                    }
                }
            }
        }`;
      expect(params).toBe(queryBody);
    });
    describe("returns correct gql aliased filters", () => {
      test("returns gql filters for 4 gene ids", () => {
        const { filters } = getAliasFilters(
          ["bulbasaur", "squirtle", "charmander"],
          "genes",
        );
        const pokeFilters = {
          filters_genes_bulbasaur: {
            op: "and",
            content: [
              {
                content: {
                  field: "genes.gene_id",
                  value: ["bulbasaur"],
                },
                op: "in",
              },
              {
                op: "NOT",
                content: {
                  field: "cases.gene.ssm.observation.observation_id",
                  value: "MISSING",
                },
              },
            ],
          },
          filters_genes_squirtle: {
            op: "and",
            content: [
              {
                content: {
                  field: "genes.gene_id",
                  value: ["squirtle"],
                },
                op: "in",
              },
              {
                op: "NOT",
                content: {
                  field: "cases.gene.ssm.observation.observation_id",
                  value: "MISSING",
                },
              },
            ],
          },
          filters_genes_charmander: {
            op: "and",
            content: [
              {
                content: {
                  field: "genes.gene_id",
                  value: ["charmander"],
                },
                op: "in",
              },
              {
                op: "NOT",
                content: {
                  field: "cases.gene.ssm.observation.observation_id",
                  value: "MISSING",
                },
              },
            ],
          },
        };
        expect(filters).toEqual(pokeFilters);
      });
    });
  });
});
