export const COHORTS = [
  {
    name: "All GDC",
    id: "ALL-GDC-COHORT",
    filters: { mode: "and", root: {} },
    caseSet: { caseSetId: { mode: "and", root: {} }, status: "uninitialized" },
    modified: false,
    saved: true,
    modified_datetime: new Date(2099, 1, 1).toISOString(),
  },
];
