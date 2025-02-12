export interface CancerDistributionSSMType {
  project: string;
  disease_type: string[];
  primary_site: string[];
  ssm_affected_cases: {
    numerator: number;
    denominator: number;
  };
  ssm_affected_cases_percent: number;
}

export interface CancerDistributionGeneType extends CancerDistributionSSMType {
  cnv_amplifications: {
    numerator: number;
    denominator: number;
  };
  cnv_amplifications_percent: number;
  cnv_gains: {
    numerator: number;
    denominator: number;
  };
  cnv_gains_percent: number;
  cnv_heterozygous_deletions: {
    numerator: number;
    denominator: number;
  };
  cnv_heterozygous_deletions_percent: number;
  cnv_homozygous_deletions: {
    numerator: number;
    denominator: number;
  };
  cnv_homozygous_deletions_percent: number;
  num_mutations: number;
}
