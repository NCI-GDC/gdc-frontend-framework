import { Cohort } from "@gff/portal-components";

export const EXAMPLE_COHORTS: Cohort[] = [
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
    modified: false,
    saved: true,
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
    modified: false,
    saved: true,
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
    modified: false,
    saved: true,
    modified_datetime: new Date(2020, 1, 6).toISOString(),
  },
  {
    name: "Lung",
    id: "0000-0000-0000-2222",
    filters: {
      root: {
        "cases.primary_site": {
          field: "cases.primary_site",
          operands: ["lung"],
          operator: "includes",
        },
      },
      mode: "and",
    },
    modified_datetime: new Date(2020, 1, 9).toISOString(),
    saved: true,
    modified: false,
  },
  {
    name: "50-60 year olds",
    id: "0000-0000-1111-2222",
    filters: {
      mode: "and",
      root: {
        "cases.diagnoses.age_at_diagnosis": {
          operator: "and",
          operands: [
            {
              field: "cases.diagnoses.age_at_diagnosis",
              operator: ">=",
              operand: 18263,
            },
            {
              field: "cases.diagnoses.age_at_diagnosis",
              operator: "<",
              operand: 21915,
            },
          ],
        },
      },
    },
    modified_datetime: new Date(2020, 1, 9).toISOString(),
    saved: true,
    modified: false,
  },
];
