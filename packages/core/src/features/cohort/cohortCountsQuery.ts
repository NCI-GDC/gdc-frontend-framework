import { createAsyncThunk } from "@reduxjs/toolkit";
import { DataStatus } from "../../dataAccess";
import { buildCohortGqlOperator, FilterSet, joinFilters } from "./filters";

import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import { graphqlAPI, GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import { UnknownJson } from "../gdcapi/gdcapi";
import { selectCohortFilterSetById } from "./utils";

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
 *  @property geneExpressionCaseCount - number of cases with gene expression data
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
  readonly geneExpressionCaseCount: number;
  readonly mafFileCount: number;
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
  ssmCaseCount: -1,
  cnvOrSsmCaseCount: -1,
  sequenceReadCaseCount: -1,
  repositoryCaseCount: -1,
  geneExpressionCaseCount: -1,
  mafFileCount: -1,
  status: "uninitialized",
  requestId: undefined,
};

const CountsGraphQLQuery = `
  query countsQuery($filters: FiltersArgument,
  $ssmCaseFilter: FiltersArgument,
  $cnvOrSsmCaseFilter: FiltersArgument,
  $sequenceReadsCaseFilter: FiltersArgument,
  $geneExpressionCaseFilter: FiltersArgument,
  $mafFileFilter: FiltersArgument) {
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
      },
      geneExpression: cases {
        hits(case_filters: $filters, filters: $geneExpressionCaseFilter, first: 0) {
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
      },
      ssmsCases : cases {
        hits(case_filters: $ssmCaseFilter, first: 0) {
          total
        }
      },
      cnvsOrSsmsCases : cases {
        hits(case_filters: $cnvOrSsmCaseFilter, first: 0) {
          total
        }
      },
      mafFileCount : cases {
        hits(case_filters: $filters, filters: $mafFileFilter, first: 0) {
          total
        }
      },
    }
  }
}`;

interface CohortCountsResponse extends GraphQLApiResponse {
  cohortFilters?: FilterSet;
}

export const fetchCohortCaseCounts = createAsyncThunk<
  CohortCountsResponse,
  string,
  { dispatch: CoreDispatch; state: CoreState }
>(
  "cohort/CohortCounts",
  async (cohortId, thunkAPI): Promise<CohortCountsResponse> => {
    const cohortFilters = selectCohortFilterSetById(
      thunkAPI.getState(),
      cohortId,
    );
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

    const geneExpressionFilters = buildCohortGqlOperator({
      mode: "and",
      root: {
        "files.analysis.workflow_type": {
          operator: "=",
          field: "files.analysis.workflow_type",
          operand: "STAR - Counts",
        },
        "files.access": {
          operator: "=",
          field: "files.access",
          operand: "open",
        },
      },
    });

    const mafFileFilter = {
      op: "and",
      content: [
        { op: "in", content: { field: "files.data_format", value: "maf" } },
        {
          op: "in",
          content: {
            field: "files.experimental_strategy",
            value: ["WXS", "Targeted Sequencing"],
          },
        },
        {
          op: "in",
          content: {
            field: "files.analysis.workflow_type",
            value: "Aliquot Ensemble Somatic Variant Merging and Masking",
          },
        },
        { op: "in", content: { field: "files.access", value: "open" } },
      ],
    };

    const cohortFiltersGQL = buildCohortGqlOperator(cohortFilters);
    const graphQlFilters = {
      filters: cohortFiltersGQL ?? {}, // the cohort filters
      ssmCaseFilter: caseSSMFilter,
      cnvOrSsmCaseFilter: caseCNVOrSSMFilter,
      sequenceReadsCaseFilter: sequenceReadsFilters,
      geneExpressionCaseFilter: geneExpressionFilters,
      mafFileFilter: mafFileFilter,
    };
    // get the data from the graphql endpoint
    const data = await graphqlAPI<UnknownJson>(
      CountsGraphQLQuery,
      graphQlFilters,
    );
    return {
      ...data,
      cohortFilters, // add the cohort filters to the response to ensure we did not receive stale data
    };
  },
);
