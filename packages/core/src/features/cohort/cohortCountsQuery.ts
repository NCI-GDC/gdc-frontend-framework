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

export interface CountsData {
  readonly caseCount: number;
  readonly fileCount: number;
  readonly genesCount: number;
  readonly mutationCount: number;
  readonly ssmCaseCount: number;
  readonly sequenceReadCaseCount: number;
  readonly repositoryCaseCount: number;
}

export interface CountsDataAndStatus extends CountsData {
  readonly status: DataStatus;
}

const CountsGraphQLQuery = `
  query countsQuery($filters: FiltersArgument,
  $ssmCaseFilter: FiltersArgument,
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
        hits(case_filters: $sequenceReadsCaseFilter, first: 0) {
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
    console.log("fetchCohortCaseCounts", cohortId);
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
    const sequenceReadsFilters = buildCohortGqlOperator(
      joinFilters(cohortFilters ?? { mode: "and", root: {} }, {
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
      }),
    );

    const cohortFiltersGQL = buildCohortGqlOperator(cohortFilters);
    const graphQlFilters = {
      filters: cohortFiltersGQL ?? {},
      ssmCaseFilter: caseSSMFilter,
      sequenceReadsCaseFilter: sequenceReadsFilters,
    };
    return await graphqlAPI(CountsGraphQLQuery, graphQlFilters);
  },
);
