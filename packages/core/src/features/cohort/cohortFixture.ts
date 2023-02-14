import { DataStatus } from "../../dataAccess";

export const COHORTS = [
  {
    name: "All GDC",
    id: "ALL-GDC-COHORT",
    filters: { mode: "and", root: {} },
    caseSet: {
      caseSetId: { mode: "and", root: {} },
      caseSetIds: undefined,
      status: "uninitialized" as DataStatus,
    },
    modified: false,
    saved: true,
    modified_datetime: new Date(2099, 1, 1).toISOString(),
  },
];
