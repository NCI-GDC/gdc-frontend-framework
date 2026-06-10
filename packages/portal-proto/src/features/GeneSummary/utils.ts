import { externalLinks, ExternalReferenceEntry } from "@/utils/externalLinks";
import { GeneSummaryData } from "@gff/core";

type GeneExternalReferencesInput = Pick<
  GeneSummaryData,
  "external_db_ids" | "gene_id" | "symbol"
>;

export const buildGeneExternalReferences = (
  data: GeneExternalReferencesInput,
): ExternalReferenceEntry[] => {
  const { external_db_ids, gene_id, symbol } = data;
  const { entrez_gene, uniprotkb_swissprot, hgnc, omim_gene } = external_db_ids;

  return [
    {
      label: "NCBI Gene",
      ids: entrez_gene,
      buildHref: (id) => externalLinks.entrez_gene(id),
    },
    {
      label: "UniProtKB Swiss-Prot",
      ids: uniprotkb_swissprot,
      buildHref: (id) => externalLinks.uniprotkb_swissprot(id),
    },
    {
      label: "HGNC",
      ids: hgnc,
      buildHref: (id) => externalLinks.hgnc(id),
    },
    {
      label: "OMIM",
      ids: omim_gene,
      buildHref: (id) => externalLinks.omim_gene(id),
    },
    {
      label: "Ensembl",
      ids: gene_id,
      buildHref: (id) => externalLinks.ensembl(id),
    },
    {
      label: "CIViC",
      ids: entrez_gene,
      buildHref: (id) => externalLinks.civic(id, "entrez_id"),
      linkTitle: "View in CIViC",
    },
    {
      label: "GeneCards",
      ids: symbol,
      buildHref: (id) => externalLinks.genecards(id),
    },
  ];
};

export type GeneSummaryTableData = {
  symbol: string;
  name: string;
  synonyms: string[];
  type: string;
  location: string;
  strand: number | null | undefined;
  description: string | null | undefined;
  isCancerGeneCensus: boolean;
};

export const buildGeneSummary = (
  data: Pick<
    GeneSummaryData,
    | "symbol"
    | "name"
    | "synonyms"
    | "biotype"
    | "gene_chromosome"
    | "gene_start"
    | "gene_end"
    | "gene_strand"
    | "description"
    | "is_cancer_gene_census"
  >,
): GeneSummaryTableData => {
  const {
    symbol,
    name,
    synonyms,
    biotype,
    gene_chromosome,
    gene_start,
    gene_end,
    gene_strand,
    description,
    is_cancer_gene_census,
  } = data;

  return {
    symbol,
    name,
    synonyms,
    type: biotype,
    location: `chr${gene_chromosome}:${gene_start}-${gene_end} (GRCh38)`,
    strand: gene_strand ?? null,
    description: description ?? null,
    isCancerGeneCensus: is_cancer_gene_census,
  };
};
