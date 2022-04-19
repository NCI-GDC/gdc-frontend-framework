export const COHORTS = [
  { name: "New Custom Cohort", filters: { mode: "and", root: {} } },
  {
    name: "Baily's Cohort",
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
  },
  {
    name: "Pancreas - KRAS mutated",
    filters: {
      root: 
        {
          "genes.symbol": {
            field: 'genes.symbol',
            operands: ['KRAS'],
            operator: 'includes',
          },
          "cases.primary_site": {
            field: 'cases.primary_site',
            operands: ['pancreas'],
            operator: 'includes',
          }
        },
      mode: 'and',
    }
  },
  {
    name: "Pancreas - KRAS not mutated",
    filters: {
      root: 
        {
          "genes.symbol": {
            field: 'genes.symbol',
            operands: ['KRAS'],
            operator: 'excludeifany',
          },
          "cases.primary_site": {
            field: 'cases.primary_site',
            operands: ['Pancreas'],
            operator: 'includes',
          }
        }, 
      mode: 'and',
    },
  }
];
