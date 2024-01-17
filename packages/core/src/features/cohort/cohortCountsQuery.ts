import { createAsyncThunk } from "@reduxjs/toolkit";
import { DataStatus } from "../../dataAccess";
import { buildCohortGqlOperator, joinFilters } from "./filters";

import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import { graphqlAPI, GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import {
  selectCohortFilterSetById,
  selectCurrentCohortFilterSet,
} from "./availableCohortsSlice";

/**
 *  CountsData holds all the case counts for a cohort
 *  @property caseCount - number of cases in cohort
 *  @property fileCount - number of files in cohort
 *  @property genesCount - number of genes in cohort
 *  @property mutationCount - number of mutations in cohort
 *  @property ssmCaseCount - number of cases with somatic mutations in cohort
 *  @property cnvOrSsmCaseCount - number of cases with somatic mutations or copy number variations in cohort
 *  @property sequenceReadCaseCount - number of cases with sequence reads in cohort
 *  @property repositoryCaseCount - number of cases using the repository index in cohort
 *  @category Cohort
 */
export interface CountsData {
  readonly caseCount: number;
  readonly fileCount: number;
  readonly genesCount: number;
  readonly mutationCount: number;
  readonly ssmCaseCount: number;
  readonly cnvOrSsmCaseCount: number;
  readonly sequenceReadCaseCount: number;
  readonly repositoryCaseCount: number;
}

export interface CountsDataAndStatus extends CountsData {
  readonly status: DataStatus;
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
  ssmCaseCount: -1,
  cnvOrSsmCaseCount: -1,
  sequenceReadCaseCount: -1,
  repositoryCaseCount: -1,
  status: "uninitialized",
};

const CountsGraphQLQuery = `
  query countsQuery($filters: FiltersArgument,
  $ssmCaseFilter: FiltersArgument,
  $cnvOrSsmCaseFilter: FiltersArgument,
  $sequenceReadsCaseFilter: FiltersArgument) {
  viewer {
    repository {
      cases {
        hits(case_filters: $filters, first: 0) {
          total
        }
      },
      files {
        hits(case_filters: $filters, first: 0) {
          total
        }
      },
      sequenceReads : cases {
        hits(filters: $sequenceReadsCaseFilter, case_filters: $filters, first: 0) {
          total
        }
      }
    },
    explore {
      cases {
        hits(case_filters: $filters, first: 0) {
          total
        }
      },
      genes {
        hits(case_filters: $filters, first: 0) {
          total
        }
      },
      ssms {
        hits(case_filters: $filters, first: 0) {
          total
        }
      }
      ssmsCases : cases {
        hits(case_filters: $ssmCaseFilter, first: 0) {
          total
        }
      }
      cnvsOrSsmsCases : cases {
        hits(case_filters: $cnvOrSsmCaseFilter, first: 0) {
          total
        }
      }
    }
  }
}`;

export const fetchCohortCaseCounts = createAsyncThunk<
  GraphQLApiResponse,
  string | undefined,
  { dispatch: CoreDispatch; state: CoreState }
>(
  "cohort/CohortCounts",
  async (cohortId, thunkAPI): Promise<GraphQLApiResponse> => {
    const cohortFilters = cohortId
      ? selectCohortFilterSetById(thunkAPI.getState(), cohortId)
      : selectCurrentCohortFilterSet(thunkAPI.getState());
    const caseSSMFilter = buildCohortGqlOperator(
      joinFilters(cohortFilters ?? { mode: "and", root: {} }, {
        mode: "and",
        root: {
          "cases.available_variation_data": {
            operator: "includes",
            field: "cases.available_variation_data",
            operands: ["ssm"],
          },
        },
      }),
    );
    const caseCNVOrSSMFilter = buildCohortGqlOperator(
      joinFilters(cohortFilters ?? { mode: "and", root: {} }, {
        mode: "and",
        root: {
          "cases.available_variation_data": {
            operator: "includes",
            field: "cases.available_variation_data",
            operands: ["ssm", "cnv"],
          },
        },
      }),
    );
    const sequenceReadsFilters = buildCohortGqlOperator({
      mode: "and",
      root: {
        "files.index_files.data_format": {
          operator: "=",
          field: "files.index_files.data_format",
          operand: "bai",
        },
        "files.data_type": {
          operator: "=",
          field: "files.data_type",
          operand: "Aligned Reads",
        },
        "files.data_format": {
          operator: "=",
          field: "files.data_format",
          operand: "bam",
        },
      },
    });

    const cohortFiltersGQL = buildCohortGqlOperator(cohortFilters);
    const graphQlFilters = {
      filters: cohortFiltersGQL ?? {},
      ssmCaseFilter: caseSSMFilter,
      cnvOrSsmCaseFilter: caseCNVOrSSMFilter,
      sequenceReadsCaseFilter: sequenceReadsFilters,
    };
    return await graphqlAPI(CountsGraphQLQuery, graphQlFilters);
  },
);
