export interface Survival {
  label: string;
  name: string;
  symbol: string;
  checked: boolean;
}

export interface Impact {
  polyphenImpact: string;
  polyphenScore: number | string;
  siftImpact: string;
  siftScore: number | string;
  vepImpact: string;
}

export interface SomaticMutation {
  select: string;
  mutation_id: string;
  dna_change: string;
  type: string;
  consequences: string;
  protein_change: {
    symbol: string;
    aaChange: string;
    geneId: string;
  };
  "#_affected_cases_in_cohort": {
    numerator: number;
    denominator: number;
  };
  "#_affected_cases_across_the_gdc": {
    numerator: number;
    denominator: number;
  };
  cohort: {
    checked: boolean;
  };
  survival: Survival;
  impact: Impact;
  ssmsTotal: number;
}

export type SsmToggledHandler = (symbol: Record<string, any>) => void;
