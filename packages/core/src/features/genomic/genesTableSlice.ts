import { SSMSAggregationsQuery } from "./ssmsAggregationsApi";
import {
  buildGenesMutationCountsFilters,
  buildGenesTableFilters,
  GenesTableGraphQLQuery,
} from "./genesTableQuery";
import { GraphQLApiResponse, graphqlAPISlice } from "../gdcapi/gdcgraphql";
import { GenomicTableProps } from "./types";
import { Union } from "../gdcapi/filters";

export interface GeneRowInfo {
  readonly biotype: string;
  readonly case_cnv_amplification: number;
  readonly case_cnv_gain: number;
  readonly case_cnv_loss: number;
  readonly case_cnv_homozygous_deletion: number;
  readonly cnv_case: number;
  readonly cytoband: Array<string>;
  readonly gene_id: string;
  readonly id: string;
  readonly is_cancer_gene_census: boolean;
  readonly name: string;
  readonly numCases: number;
  readonly ssm_case: number;
  readonly symbol: string;
}

export interface GDCGenesTable {
  readonly cases: number;
  readonly cnvCases: number;
  readonly filteredCases: number;
  readonly genes: ReadonlyArray<GeneRowInfo>;
  readonly genes_total: number;
  readonly mutationCounts: Record<string, string>;
}

export type CnvChange =
  | "Amplification"
  | "Gain"
  | "Loss"
  | "Homozygous Deletion";

export const buildGeneTableSearchFilters = (
  term?: string,
): Union | undefined => {
  if (term !== undefined) {
    return {
      operator: "or",
      operands: [
        {
          operator: "includes",
          field: "genes.cytoband",
          operands: [`*${term}*`],
        },
        {
          operator: "includes",
          field: "genes.gene_id",
          operands: [`*${term}*`],
        },
        {
          operator: "includes",
          field: "genes.symbol",
          operands: [`*${term}*`],
        },
        { operator: "includes", field: "genes.name", operands: [`*${term}*`] },
      ],
    };
  }
  return undefined;
};

const transformGenesTableResponse = (
  genesTable: GraphQLApiResponse<any>,
  mutationCounts: GraphQLApiResponse<any>,
): GDCGenesTable => {
  const { cases, cnvCases, filteredCases, genes } =
    genesTable.data.genesTableViewer.explore;

  const mutationCountBuckets: { key: string; doc_count: number }[] =
    mutationCounts.data.ssmsAggregationsViewer.explore.ssms.aggregations
      .consequence__transcript__gene__gene_id.buckets;
  const mutationCountsByGene = Object.fromEntries(
    mutationCountBuckets.map(({ key, doc_count }) => [
      key,
      doc_count.toLocaleString(),
    ]),
  );

  const geneRows = genes.hits.edges.map(
    ({ node }: Record<string, any>): GeneRowInfo => ({
      id: node.id,
      gene_id: node.gene_id,
      symbol: node.symbol,
      name: node.name,
      cytoband: node.cytoband,
      biotype: node.biotype,
      is_cancer_gene_census: node.is_cancer_gene_census,
      numCases: node.numCases,
      ssm_case: node.ssm_case.hits.total,
      cnv_case: node.cnv_case.hits.total,
      case_cnv_gain: node.case_cnv_gain.hits.total,
      case_cnv_loss: node.case_cnv_loss.hits.total,
      case_cnv_amplification: node.case_cnv_amplification.hits.total,
      case_cnv_homozygous_deletion:
        node.case_cnv_homozygous_deletion.hits.total,
    }),
  );

  return {
    cases: cases.hits.total,
    cnvCases: cnvCases.hits.total,
    filteredCases: filteredCases.hits.total,
    genes_total: genes.hits.total,
    mutationCounts: mutationCountsByGene,
    genes: geneRows,
  };
};

export const genesTableApiSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    genesTable: builder.query<GDCGenesTable, GenomicTableProps>({
      queryFn: async (args, _queryApi, _extraOptions, fetchWithBQ) => {
        const genesTableResult = await fetchWithBQ({
          graphQLQuery: GenesTableGraphQLQuery,
          graphQLFilters: buildGenesTableFilters(args),
        });
        if (genesTableResult.error) return { error: genesTableResult.error };

        const genesTable = genesTableResult.data as GraphQLApiResponse<any>;
        if (genesTable.errors)
          return { error: JSON.stringify(genesTable.errors) };

        const geneIds =
          genesTable.data.genesTableViewer.explore.genes.hits.edges.map(
            ({ node }: Record<string, any>) => node.gene_id,
          );
        const mutationCountsResult = await fetchWithBQ({
          graphQLQuery: SSMSAggregationsQuery,
          graphQLFilters: buildGenesMutationCountsFilters(args, geneIds),
        });
        if (mutationCountsResult.error)
          return { error: mutationCountsResult.error };

        const mutationCounts =
          mutationCountsResult.data as GraphQLApiResponse<any>;
        if (mutationCounts.errors)
          return { error: JSON.stringify(mutationCounts.errors) };

        return {
          data: transformGenesTableResponse(genesTable, mutationCounts),
        };
      },
    }),
  }),
});

export const { useGenesTableQuery } = genesTableApiSlice;
