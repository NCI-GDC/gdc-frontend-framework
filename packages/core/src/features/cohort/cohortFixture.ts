export const COHORTS = [
  { name: "New Custom Cohort", facets: [] },
  {
    name: "Baily's Cohort",
    filters: {
      mode: 'and',
      root: {
        'cases.primary_site': {
          operator: 'includes',
          field: 'cases.primary_site',
          operands: [
            'breast',
            'bronchus and lung'
          ]
        }
      }
    },
  },
];
