import { createAsyncThunk } from "@reduxjs/toolkit";
import { DataStatus } from "../../dataAccess";
import { buildCohortGqlOperator, FilterSet } from "./filters";

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
 *  @property repositoryCaseCount - number of cases using the repository index in cohort
 *  @category Cohort
 */
export interface CountsData {
  readonly caseCount: number;
  readonly fileCount: number;
  readonly genesCount: number;
  readonly mutationCount: number;
  readonly repositoryCaseCount: number;
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
  repositoryCaseCount: -1,
  status: "uninitialized",
  requestId: undefined,
};

const CountsGraphQLQuery = `
  query countsQuery($filters: FiltersArgument) {
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

    const cohortFiltersGQL = buildCohortGqlOperator(cohortFilters);
    const graphQlFilters = {
      filters: cohortFiltersGQL ?? {}, // the cohort filters
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
