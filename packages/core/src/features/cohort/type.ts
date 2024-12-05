import { DataStatus } from "../../dataAccess";

/**
 *  CountsData holds all the case counts for a cohort
 *  @property caseCount - number of cases in cohort
 *  @property fileCount - number of files in cohort
 *  @property genesCount - number of genes in cohort
 *  @property mutationCount - number of mutations in cohort
 *  @category Cohort
 */
export interface CountsData {
  readonly caseCount: number;
  readonly fileCount: number;
  readonly genesCount: number;
  readonly mutationCount: number;
}

export interface CountsDataAndStatus extends CountsData {
  readonly status: DataStatus;
  readonly requestId?: string;
}

/**
 * Constant representing Null Counts or uninitialized counts
 * @category Cohort
 */
export const NullCountsData: CountsDataAndStatus = {
  caseCount: -1,
  fileCount: -1,
  genesCount: -1,
  mutationCount: -1,
  status: "uninitialized",
  requestId: undefined,
};
