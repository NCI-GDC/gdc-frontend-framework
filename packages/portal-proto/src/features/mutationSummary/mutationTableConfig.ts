import { Column } from "@/components/expandableTables/shared/types";

export const DEFAULT_CONSEQUENCE_TABLE_ORDER: Column[] = [
  { id: "gene", columnName: "Gene", visible: true },
  { id: "aa_change", columnName: "AA Change", visible: true },
  { id: "DNAChange", columnName: "DNA Change", visible: true },
  {
    id: "consequences",
    columnName: "Consequences",
    visible: true,
  },
  { id: "impact", columnName: "Impact", visible: true },
  { id: "gene_strand", columnName: "Gene Strand", visible: true },
  { id: "transcript_id", columnName: "Transcript", visible: true },
] as Column[];
