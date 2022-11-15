import { Cohort } from "../availableCohortsSlice";

export const MOCK_COHORTS: Cohort[] = [
  {
    name: "All GDC",
    id: "ALL-GDC-COHORT",
    filters: { mode: "and", root: {} },
    caseSet: { caseSetId: { mode: "and", root: {} }, status: "uninitialized" },
    modified: false,
    modified_datetime: new Date(2099, 1, 1).toISOString(),
  },
  {
    name: "Baily's Cohort",
    id: "0000-0000-1000-0000",
    filters: {
      mode: "and",
      root: {
        "cases.primary_site": {
          operator: "includes",
          field: "cases.primary_site",
          operands: ["breast", "bronchus and lung"],
        },
      },
    },
    caseSet: { caseSetId: { mode: "and", root: {} }, status: "uninitialized" },
    modified: false,
    modified_datetime: new Date(2020, 1, 15).toISOString(),
  },
  {
    name: "Pancreas",
    id: "0000-0000-1001-0000",
    filters: {
      root: {
        "cases.primary_site": {
          field: "cases.primary_site",
          operands: ["pancreas"],
          operator: "includes",
        },
      },
      mode: "and",
    },
    modified_datetime: new Date(2020, 1, 9).toISOString(),
    caseSet: { caseSetId: { mode: "and", root: {} }, status: "uninitialized" },
    modified: false,
  },
  {
    name: "Pancreas - KRAS mutated",
    id: "0000-0000-1002-0000",
    filters: {
      root: {
        "genes.symbol": {
          field: "genes.symbol",
          operands: ["KRAS"],
          operator: "includes",
        },
        "cases.primary_site": {
          field: "cases.primary_site",
          operands: ["pancreas"],
          operator: "includes",
        },
      },
      mode: "and",
    },
    caseSet: { caseSetId: { mode: "and", root: {} }, status: "uninitialized" },
    modified: false,
    modified_datetime: new Date(2020, 1, 8).toISOString(),
  },
  {
    name: "Pancreas - KRAS not mutated",
    id: "0000-0000-1003-0000",
    filters: {
      root: {
        "genes.symbol": {
          field: "genes.symbol",
          operands: ["KRAS"],
          operator: "excludeifany",
        },
        "cases.primary_site": {
          field: "cases.primary_site",
          operands: ["pancreas"],
          operator: "includes",
        },
      },
      mode: "and",
    },
    caseSet: { caseSetId: { mode: "and", root: {} }, status: "uninitialized" },
    modified: false,
    modified_datetime: new Date(2020, 1, 7).toISOString(),
  },
  {
    name: "breast, true",
    id: "0000-0000-1004-0000",
    filters: {
      root: {
        "cases.primary_site": {
          operator: "includes",
          field: "cases.primary_site",
          operands: ["breast"],
        },
        "genes.is_cancer_gene_census": {
          operator: "includes",
          field: "gene.is_cancer_gene_census",
          operands: ["true"],
        },
      },
      mode: "and",
    },
    caseSet: { caseSetId: { mode: "and", root: {} }, status: "uninitialized" },
    modified: false,
    modified_datetime: new Date(2020, 1, 6).toISOString(),
  },
];
