import { Buckets } from "../../gdcapi/gdcapi";
import { GraphQLApiResponse, graphqlAPISlice } from "../../gdcapi/gdcgraphql";
import { startCase } from "lodash";
import { getAliasFilters, getAliasGraphQLQuery } from "./gqlmod";

export interface SubrowResponse {
  explore: {
    cases: {
      denominators: {
        project__project_id: Buckets;
      };
      [x: string]: {
        project__project_id: Buckets;
      };
    };
  };
}

export interface TableSubrowItem {
  project: string;
  numerator: number;
  denominator: number;
}

export interface Gene {
  gene_id: string;
  symbol: string;
}
export interface Annotation {
  transcript: {
    annotation: {
      polyphen_impact: string;
      polyphen_score: number;
      sift_score: number;
      sift_impact: string;
      vep_impact: string;
    };
  };
}

export interface Consequence {
  aa_change: string;
  transcript: {
    aa_change: string;
    gene: {
      symbol: string;
    };
  };
  consequence_type: string;
  gene: Gene;
  id: string;
  is_canonical: boolean;
}

export interface ConsequenceSSMS {
  aa_change: string;
  transcript: {
    aa_change: string;
    gene: {
      symbol: string;
    };
  };
  consequence_type: string;
  gene: Gene;
  id: string;
  is_canonical: boolean;
}

export interface SSMData {
  ssm_id: string;
  occurrence: number;
  filteredOccurrences: number;
  genomic_dna_change: string;
  mutation_subtype: string;
  consequence: Consequence[];
  annotation: Annotation;
}

export interface MutatedGenesFreqTransformedItem {
  gene_id: string;
  symbol: string;
  name: string;
  cytoband: string;
  biotype: string;
  ssmsAffectedCasesInCohort: string;
  ssmsAffectedCasesAcrossGDC: string;
  cnvGain: string;
  cnvLoss: string;
  mutations: string;
  is_cancer_gene_census: boolean;
}

export interface MutationsFreqTransformedItem {
  dnaChange: string;
  proteinChange: string;
  mutationId: string;
  type: string;
  consequences: string;
  ssmsAffectedCasesInCohort: string;
  ssmsAffectedCasesAcrossGDC: string;
  impact: string;
}

export type TableSubrowData = Partial<TableSubrowItem>;
export type MutatedGenesFreqTransformedData =
  Partial<MutatedGenesFreqTransformedItem>;
export type MutationsFreqTransformedData =
  Partial<MutationsFreqTransformedItem>;

export const tableSubrowApiSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    getGeneTableSubrow: builder.query({
      query: (request: { id: string }) => ({
        graphQLQuery: getAliasGraphQLQuery([request.id], "genes") as string,
        graphQLFilters: getAliasFilters([request.id], "genes") as Record<
          string,
          unknown
        >,
      }),
      transformResponse: (
        response: GraphQLApiResponse<SubrowResponse>,
      ): TableSubrowData[] => {
        const { cases } = response?.data?.explore;

        const {
          denominators: {
            project__project_id: { buckets: d = [] },
          },
          ...filter
        } = cases;

        const {
          [`${Object.keys(filter)[0]}`]: {
            project__project_id: { buckets: n = [] },
          },
        } = cases;

        const transformedBuckets = n.map(({ doc_count, key: project }) => {
          return {
            project,
            numerator: doc_count,
            denominator: d.find(({ key }) => key === project)?.doc_count,
          };
        });

        return transformedBuckets as TableSubrowData[];
      },
    }),
    mutatedGenesFreqDL: builder.query<
      Record<string, MutatedGenesFreqTransformedItem[]>,
      { geneIds: string[]; tableData: any }
    >({
      async queryFn(arg, _queryApi, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ({
          graphQLQuery: getAliasGraphQLQuery(arg.geneIds, "genes") as string,
          graphQLFilters: getAliasFilters(arg.geneIds, "genes") as Record<
            string,
            unknown
          >,
        });
        const { genes, cnvCases, filteredCases, mutationCounts } =
          arg?.tableData;

        const { denominators, ...remaining } =
          result?.data?.data?.explore?.cases;

        const mutatedGenes = genes.map(
          ({
            gene_id,
            symbol,
            name,
            cytoband,
            biotype,
            numCases,
            case_cnv_gain,
            case_cnv_loss,
            is_cancer_gene_census,
          }: {
            gene_id: string;
            symbol: string;
            name: string;
            cytoband: string[];
            biotype: string;
            numCases: number;
            case_cnv_gain: number;
            case_cnv_loss: number;
            is_cancer_gene_census: boolean;
          }) => {
            return {
              gene_id,
              symbol,
              name,
              cytoband: cytoband.join(", "),
              biotype,
              ssmsAffectedCasesInCohort: `${numCases} / ${filteredCases} (${(
                100 *
                (numCases / filteredCases)
              ).toFixed(2)}%)`,
              ssmsAffectedCasesAcrossGDC: remaining[
                `filters_genes_${gene_id}`.replaceAll("-", "_")
              ]?.project__project_id?.buckets
                ?.map(
                  ({
                    doc_count: n,
                    key: project,
                  }: {
                    doc_count: number;
                    key: string;
                  }) => {
                    const d = denominators?.project__project_id?.buckets.find(
                      ({ key }: { key: string }) => key === project,
                    )?.doc_count;
                    return `${project}: ${n} / ${d} (${(100 * (n / d)).toFixed(
                      2,
                    )}%)`;
                  },
                )
                .join(", "),
              cnvGain: `${case_cnv_gain} / ${cnvCases} (${(
                100 *
                (case_cnv_gain / cnvCases)
              ).toFixed(2)}%)`,
              cnvLoss: `${case_cnv_loss} / ${cnvCases} (${(
                100 *
                (case_cnv_loss / cnvCases)
              ).toFixed(2)}%)`,
              ...(mutationCounts[gene_id] && {
                mutations: mutationCounts[gene_id],
              }),
              is_cancer_gene_census: is_cancer_gene_census
                ? "Cancer Gene Census"
                : "",
            };
          },
        );
        return {
          data: { results: mutatedGenes as MutatedGenesFreqTransformedItem[] },
        };
      },
    }),
    getSomaticMutationTableSubrow: builder.query({
      query: (request: { id: string }) => ({
        graphQLQuery: getAliasGraphQLQuery(
          [request.id.replaceAll("-", "_")],
          "ssms",
        ) as string,
        graphQLFilters: getAliasFilters(
          [request.id.replaceAll("-", "_")],
          "ssms",
        ) as Record<string, unknown>,
      }),
      transformResponse: (
        response: GraphQLApiResponse<SubrowResponse>,
      ): TableSubrowData[] => {
        const { cases } = response?.data?.explore;

        const {
          denominators: {
            project__project_id: { buckets: d = [] },
          },
          ...filter
        } = cases;

        const {
          [`${Object.keys(filter)[0]}`]: {
            project__project_id: { buckets: n = [] },
          },
        } = cases;
        const transformedBuckets = n.map(({ doc_count, key: project }) => {
          return {
            project,
            numerator: doc_count,
            denominator: d.find(({ key }) => key === project)?.doc_count,
          };
        });

        return transformedBuckets as TableSubrowData[];
      },
    }),
    mutationsFreqDL: builder.query<
      Record<string, MutationsFreqTransformedItem[]>,
      { ssmsIds: string[]; tableData: any }
    >({
      async queryFn(arg, _queryApi, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ({
          graphQLQuery: getAliasGraphQLQuery(
            arg?.ssmsIds?.map((id) => id.replaceAll("-", "_")),
            "ssms",
          ),
          graphQLFilters: getAliasFilters(
            arg?.ssmsIds?.map((id) => id.replaceAll("-", "_")),
            "ssms",
          ),
        });
        const { filteredCases, ssms } = arg?.tableData;

        const { denominators, ...remaining } =
          result?.data?.data?.explore?.cases;

        const mutationsFreq = ssms.map(
          ({
            genomic_dna_change,
            ssm_id,
            filteredOccurrences,
            mutation_subtype,
            consequence,
          }: {
            genomic_dna_change: string;
            ssm_id: string;
            filteredOccurrences: number;
            mutation_subtype: string;
            consequence: any;
          }) => {
            return {
              dnaChange: genomic_dna_change,
              proteinChange: consequence?.length
                ? (consequence || []).map(
                    ({
                      transcript: {
                        aa_change,
                        gene: { symbol },
                      },
                    }: Consequence) => {
                      return `${aa_change} ${symbol ?? ""}`;
                    },
                  )[0]
                : "",
              mutationId: ssm_id,
              type: [
                "Oligo-nucleotide polymorphism",
                "Tri-nucleotide polymorphism",
              ].includes(mutation_subtype)
                ? mutation_subtype
                : startCase(mutation_subtype?.split(" ").at(-1)),
              consequences: consequence?.length
                ? consequence[0]?.transcript?.consequence_type
                : "",
              ssmsAffectedCasesInCohort: `${filteredOccurrences} / ${filteredCases} (${(
                100 *
                (filteredOccurrences / filteredCases)
              ).toFixed(2)}%)`,
              ssmsAffectedCasesAcrossGDC: remaining[
                `filters_ssms_${ssm_id}`.replaceAll("-", "_")
              ]?.project__project_id?.buckets
                ?.map(
                  ({
                    doc_count: n,
                    key: project,
                  }: {
                    doc_count: number;
                    key: string;
                  }) => {
                    const d = denominators?.project__project_id?.buckets.find(
                      ({ key }: { key: string }) => key === project,
                    )?.doc_count;
                    return `${project}: ${n} / ${d} (${(100 * (n / d)).toFixed(
                      2,
                    )}%)`;
                  },
                )
                .join(", "),
              impact: consequence?.length
                ? consequence.map(
                    ({
                      transcript: {
                        annotation: {
                          vep_impact: v = "",
                          sift_impact: s = "",
                          sift_score,
                          polyphen_impact: p = "",
                          polyphen_score,
                        },
                      },
                    }: Annotation) => {
                      return [
                        v ? `VEP: ${v}` : ``,
                        s ? `SIFT: ${s} - score ${sift_score}` : ``,
                        p ? `PolyPhen: ${p} - score ${polyphen_score}` : ``,
                      ]
                        .filter(({ length }) => length)
                        .join(",");
                    },
                  )[0]
                : "",
            };
          },
        );
        return {
          data: { results: mutationsFreq as MutationsFreqTransformedItem[] },
        };
      },
    }),
  }),
});

export const {
  useGetGeneTableSubrowQuery,
  useMutatedGenesFreqDLQuery,
  useMutationsFreqDLQuery,
  useGetSomaticMutationTableSubrowQuery,
} = tableSubrowApiSlice;
