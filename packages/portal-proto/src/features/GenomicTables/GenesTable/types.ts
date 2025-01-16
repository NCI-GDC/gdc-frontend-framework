export interface Survival {
  label: string;
  name: string;
  symbol: string;
  checked: boolean;
}
export type GeneToggledHandler = (symbol: Record<string, any>) => void;

export interface Gene {
  gene_id: string;
  name: string;
  type: string;
  cohort: {
    checked: boolean;
  };
  symbol: string;
  survival: Survival;
  "#_cnv_amplifications": {
    numerator: number;
    denominator: number;
  };
  "#_cnv_gains": {
    numerator: number;
    denominator: number;
  };
  "#_cnv_heterozygous_deletions": {
    numerator: number;
    denominator: number;
  };
  "#_cnv_homozygous_deletions": {
    numerator: number;
    denominator: number;
  };
  cytoband: string[];
  annotations: boolean;
  "#_mutations": string;
  "#_ssm_affected_cases_in_cohort": {
    numerator: number;
    denominator: number;
  };
  "#_ssm_affected_cases_across_the_gdc": {
    numerator: number;
    denominator: number;
  };
}
