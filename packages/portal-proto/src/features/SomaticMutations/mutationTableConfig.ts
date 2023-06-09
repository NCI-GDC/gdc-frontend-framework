import { Column } from "@/components/expandableTables/shared/";

export const DEFAULT_CONSEQUENCE_TABLE_ORDER: Column[] = [
  { id: "gene", columnName: "Gene", visible: true },
  { id: "aa_change", columnName: "AA Change", visible: true },
  {
    id: "consequences",
    columnName: "Consequences",
    visible: true,
  },
  { id: "DNAChange", columnName: "Coding DNA Change", visible: true },
  { id: "impact", columnName: "Impact", visible: true },
  { id: "gene_strand", columnName: "Gene Strand", visible: true },
  { id: "transcript_id", columnName: "Transcript", visible: true },
] as Column[];

export const DEFAULT_SMTABLE_ORDER: Column[] = [
  { id: "selected", columnName: "Select", visible: true },
  { id: "cohort", columnName: "Cohort", visible: true },
  { id: "survival", columnName: "Survival", visible: true },
  { id: "mutationID", columnName: "Mutation ID", visible: false },
  { id: "DNAChange", columnName: "DNA Change", visible: true },
  { id: "proteinChange", columnName: "Protein Change", visible: true },
  { id: "type", columnName: "Type", visible: true },
  {
    id: "consequences",
    columnName: "Consequences",
    visible: true,
  },
  {
    id: "affectedCasesInCohort",
    columnName: "# Affected Cases in Cohort",
    visible: true,
  },
  {
    id: "affectedCasesAcrossTheGDC",
    columnName: "# Affected Cases Across the GDC",
    visible: true,
  },
  { id: "impact", columnName: "Impact", visible: true },
] as Column[];

export const DEFAULT_SMTABLEORDER_CASE_GENE_SUMMARY = [
  { id: "selected", columnName: "Select", visible: true },
  { id: "mutationID", columnName: "Mutation ID", visible: false },
  { id: "DNAChange", columnName: "DNA Change", visible: true },
  { id: "proteinChange", columnName: "Protein Change", visible: true },
  { id: "type", columnName: "Type", visible: true },
  {
    id: "consequences",
    columnName: "Consequences",
    visible: true,
  },
  {
    id: "affectedCasesInCohort",
    columnName: "# Affected Cases in Gene",
    visible: true,
  },
  {
    id: "affectedCasesAcrossTheGDC",
    columnName: "# Affected Cases Across the GDC",
    visible: true,
  },
  { id: "impact", columnName: "Impact", visible: true },
];
