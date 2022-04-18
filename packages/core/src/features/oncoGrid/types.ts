export interface Gene {
  readonly gene_id: string;
  readonly is_cancer_gene_census: boolean;
  readonly symbol: string;
  readonly _score: number;
}

export interface OncoGridDonor {
  readonly case_id: string;
  readonly submitter_id: string;
  readonly demographic: {
    ethnicity?: string;
    gender?: string;
    race?: string;
    vital_status?: string;
    days_to_death?: number;
  };
  readonly diagnoses: Array<{ age_at_diagnosis: number }>;
  readonly project: {
    project_id: string;
  };
  readonly summary: {
    data_categories: Array<{
      filecount: number;
      data_category: string;
    }>;
  };
}

export interface SSMOccurrence {
  readonly id: string;
  readonly case: {
    case_id: string;
  };
  readonly ssm: {
    ssm_id: string;
    consequence: Array<{
      transcript: {
        consequence_type: string;
        is_canonical: boolean;
        annotation: {
          vep_impact: string;
        };
        gene: {
          gene_id: string;
        };
      };
    }>;
  };
}

export interface CNVOccurrence {
  readonly cnv: {
    cnv_id: string;
    cnv_change: string;
    consequence: Array<{
      gene: {
        gene_id: string;
      };
    }>;
  };
  readonly case: {
    case_id: string;
  };
  readonly cnv_occurrence_id: string;
}
