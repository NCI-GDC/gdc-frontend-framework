import { Cohort } from "../availableCohortsSlice";
import { DataStatus } from "../../../dataAccess";

export const MOCK_COHORTS: Cohort[] = [
  {
    name: "All GDC",
    id: "ALL-GDC-COHORT",
    filters: { mode: "and", root: {} },
    caseSet: { status: "uninitialized" },
    counts: {
      caseCount: 845678,
      fileCount: 1010101,
      genesCount: 24568,
      mutationCount: 22233445566,
      ssmCaseCount: 23450,
      sequenceReadCaseCount: 22342,
      repositoryCaseCount: 845678,
      status: "fulfilled" as DataStatus,
    },
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
    caseSet: { status: "uninitialized" },
    counts: {
      caseCount: 2002,
      fileCount: 234456,
      genesCount: 2239,
      mutationCount: 2890,
      ssmCaseCount: 126,
      sequenceReadCaseCount: 127,
      repositoryCaseCount: 2002,
      status: "fulfilled" as DataStatus,
    },
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
    caseSet: { status: "uninitialized" },
    counts: {
      caseCount: 4456,
      fileCount: 76000,
      genesCount: 1290,
      mutationCount: 2877,
      ssmCaseCount: 543,
      sequenceReadCaseCount: 2312,
      repositoryCaseCount: 4456,
      status: "fulfilled" as DataStatus,
    },
    saved: false,
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
    caseSet: { status: "uninitialized" },
    counts: {
      caseCount: 8998,
      fileCount: 223322,
      genesCount: 2233,
      mutationCount: 98798,
      ssmCaseCount: 276,
      sequenceReadCaseCount: 287,
      repositoryCaseCount: 8998,
      status: "fulfilled" as DataStatus,
    },
    modified: false,
    saved: true,
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
    caseSet: { status: "uninitialized" },
    counts: {
      caseCount: 12987,
      fileCount: 323322,
      genesCount: 233,
      mutationCount: 8798,
      ssmCaseCount: 276,
      sequenceReadCaseCount: 2287,
      repositoryCaseCount: 12987,
      status: "fulfilled" as DataStatus,
    },
    modified: false,
    saved: false,
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
    caseSet: { status: "uninitialized" },
    counts: {
      caseCount: 7743,
      fileCount: 45664,
      genesCount: 1298,
      mutationCount: 6549,
      ssmCaseCount: 6501,
      sequenceReadCaseCount: 1983,
      repositoryCaseCount: 7743,
      status: "fulfilled" as DataStatus,
    },
    modified: false,
    saved: false,
    modified_datetime: new Date(2020, 1, 6).toISOString(),
  },
];
