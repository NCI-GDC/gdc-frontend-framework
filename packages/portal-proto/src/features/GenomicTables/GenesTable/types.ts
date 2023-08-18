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
  "#_cnv_gain": {
    numerator: number;
    denominator: number;
  };
  "#_cnv_loss": {
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

export type columnFilterType = "cnvgain" | "cnvloss" | "ssmaffected" | null;
