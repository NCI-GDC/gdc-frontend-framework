export const FIELD_CONSTANTS = {
  GENE_IDX_GENE_ID: "genes.gene_id",
  SSM_IDX_SSM_ID: "ssms.ssm_id",
};

// These fields have been deprecated from being added to cohorts because they don't exist in the case_centric
// index. However, we don't want to flag existing cohorts with these fields as being invalid
export const COHORT_FIELD_EXCEPTIONS = [
  FIELD_CONSTANTS.GENE_IDX_GENE_ID,
  FIELD_CONSTANTS.SSM_IDX_SSM_ID,
];
