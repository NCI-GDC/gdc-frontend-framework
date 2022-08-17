import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { graphqlAPI, GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import { GQLIndexType } from "../facets/types";
import {
  buildCohortGqlOperator,
  FilterSet,
  selectCurrentCohortFilterSet,
} from "./cohortFilterSlice";
import { fetchFacetByNameGQL } from "../facets/facetSliceGQL";
import { CoreDataSelectorResponse, DataStatus } from "../../dataAccess";

const buildCaseSetMutationQuery = (index: string) =>
  `
 mutation mutationsCreateRepositoryCaseSetMutation(
  $input: CreateSetInput
  $never_used: RelayIsDumb
) {
  sets(input: $never_used) {
    create {
      ${index} {
        case(input: $input) {
          set_id
          size
        }
      }
    }
  }
}`;

export const mutateCreateCaseSet = (
  filters: FilterSet,
  index: GQLIndexType = "explore",
) => {
  const graphQL = buildCaseSetMutationQuery(index);
  const filtersGQL = {
    filters_0: filters ? filters : {},
  };
  return graphqlAPI(graphQL, filtersGQL);
};

export interface CreateCaseSetProps {
  readonly filterSelector?: (state: CoreState) => FilterSet;
  readonly index?: GQLIndexType;
}

export const createCaseSet = createAsyncThunk<
  GraphQLApiResponse<Record<string, any>>,
  CreateCaseSetProps,
  { dispatch: CoreDispatch; state: CoreState }
>(
  "cohort/createCaseSet",
  async (
    {
      filterSelector = selectCurrentCohortFilterSet,
      index = "repository" as GQLIndexType,
    },
    thunkAPI,
  ) => {
    const filters = buildCohortGqlOperator(filterSelector(thunkAPI.getState()));
    const graphQL = buildCaseSetMutationQuery(index);

    const filtersGQL = {
      input: { filters: filters ? filters : {} },
      never_used: null,
    };
    return graphqlAPI(graphQL, filtersGQL);
  },
);

export interface CaseSetState {
  readonly status: DataStatus;
  readonly error?: string;
  readonly caseSetId: FilterSet;
}

const initialState: CaseSetState = {
  status: "uninitialized",
  caseSetId: { mode: "and", root: {} },
};

export const createCaseSetSlice = createSlice({
  name: "cohort/createCaseSet",
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clearCaseSet: (_) => {
      return {
        status: "uninitialized",
        caseSetId: { mode: "and", root: {} },
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCaseSet.fulfilled, (_, action) => {
        const response = action.payload;
        if (response.errors && Object.keys(response.errors).length > 0) {
          return {
            caseSetId: { mode: "and", root: {} },
            status: "rejected",
            error: response.errors.sets,
          };
        }

        const index = action.meta.arg.index ?? "explore";
        const data = response.data.sets.create[index];
        const filter: FilterSet = {
          mode: "and",
          root: {
            "cases.case_id": {
              field: "cases.case_id",
              operator: "includes",
              operands: [`set_id:${data.case.set_id}`],
            },
          },
        };
        return {
          status: "fulfilled",
          caseSetId: filter,
        };
      })
      .addCase(createCaseSet.pending, () => {
        return {
          caseSetId: { mode: "and", root: {} },
          status: "pending",
        };
      })
      .addCase(fetchFacetByNameGQL.rejected, () => {
        return {
          caseSetId: { mode: "and", root: {} },
          status: "rejected",
        };
      });
  },
});

export const caseSetReducer = createCaseSetSlice.reducer;
export const { clearCaseSet } = createCaseSetSlice.actions;

export const selectCurrentCohortCaseSet = (
  state: CoreState,
): CoreDataSelectorResponse<FilterSet> => {
  return {
    data: state.cohort.caseSet.caseSetId as FilterSet,
    status: state.cohort.caseSet.status,
    error: state.cohort.caseSet.error,
  };
};

export const selectCurrentCohortCaseSetFilter = (
  state: CoreState,
): FilterSet => {
  return state.cohort.caseSet.caseSetId;
};
