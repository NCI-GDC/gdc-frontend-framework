import { Column } from "@/components/expandableTables/shared/types";

export const DEFAULT_CASE_SUMMARY_SSMS_TABLE_ORDER: Column[] = [
  { id: "select", columnName: "Select", visible: true },
  { id: "DNAChange", columnName: "DNA Change", visible: true },
  { id: "proteinChange", columnName: "Protein Change", visible: true },
  { id: "mutationID", columnName: "Mutation ID", visible: false },
  { id: "type", columnName: "Type", visible: true },
  {
    id: "consequences",
    columnName: "Consequences",
    visible: true,
  },
  {
    id: "affectedCasesInCohort",
    columnName: "# Affected Cases in Cases",
    visible: true,
  },
  {
    id: "affectedCasesAcrossTheGDC",
    columnName: "# Affected Cases Across the GDC",
    visible: true,
  },
  { id: "impact", columnName: "Impact", visible: true },
] as Column[];
