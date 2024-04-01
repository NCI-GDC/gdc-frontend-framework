export type QuickSearchEntities =
  | "case"
  | "file"
  | "project"
  | "annotation"
  | "gene_centric"
  | "ssm_centric"
  | "Case"
  | "File"
  | "Project"
  | "Annotation"
  | "Gene"
  | "Ssm";

export const entityShortNameMapping: Record<QuickSearchEntities, string> = {
  case: "CA",
  file: "FL",
  project: "PR",
  annotation: "AN",
  gene_centric: "GN",
  ssm_centric: "MU",

  Case: "CA",
  File: "FL",
  Project: "PR",
  Annotation: "AN",
  Gene: "GN",
  Ssm: "MU",
};
