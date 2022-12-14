import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  buildCaseSetMutationQuery,
  divideFilterSetByPrefix,
  REQUIRES_CASE_SET_FILTERS,
  graphqlAPI,
  GraphQLApiResponse,
  DataStatus,
  processCaseSetResponse,
  buildCaseSetFilters,
  FilterSet,
  AppDataSelectorResponse,
  buildCohortGqlOperator,
  Operation,
} from "@gff/core";
import { AppDispatch, AppState } from "./appApi";
import { createUseAppDataHook } from "./hooks";

export interface CreateGenomicCaseSetProps {
  readonly caseSetId: string; // pass a caseSetId to use
  readonly filters: FilterSet;
}

export const buildCaseSetGQLQueryAndVariablesFromFilters = (
  filters: FilterSet,
  id: string,
): Record<string, any> => {
  const prefix = Object.keys(filters.root)
    .map((x) => x.split(".")[0])
    .filter((v, i, a) => a.indexOf(v) == i);
  const sorted = Object.keys(filters.root).reduce(
    (obj, filterName) => {
      const filterPrefix = filterName.split(".")[0];
      return {
        ...obj,
        [filterPrefix]: {
          ...obj[filterPrefix],
          [filterName]: filters.root[filterName],
        },
      };
    },
    prefix.reduce(
      (obj, pfx) => ({
        ...obj,
        [pfx]: {},
      }),
      {},
    ),
  );

  return {
    query: prefix
      .map(
        (name) => `${name}Cases : case (input: $input${name}) { set_id size }`,
      )
      .join(","),

    parameters: prefix
      .map((name) => ` $input${name}: CreateSetInput`)
      .join(","),

    variables: Object.entries(sorted).reduce((obj, [key, value]) => {
      return {
        ...obj,
        [`input${key}`]: {
          filters: buildCohortGqlOperator({
            mode: "and",
            root: value as Record<string, Operation>,
          }),
          set_id: `${key}-${id}`,
        },
      };
    }, {}),
  };
};

export const createGenomicCaseSet = createAsyncThunk<
  GraphQLApiResponse<Record<string, any>>,
  CreateGenomicCaseSetProps,
  { dispatch: AppDispatch; state: AppState }
>(
  "mutationFrequencyApp/createCaseSet",

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ({ caseSetId, filters = undefined }) => {
    const dividedFilters = divideFilterSetByPrefix(
      filters,
      REQUIRES_CASE_SET_FILTERS,
    );

    const { query, parameters, variables } =
      buildCaseSetGQLQueryAndVariablesFromFilters(
        dividedFilters.withPrefix,
        caseSetId,
      );

    const graphQL = buildCaseSetMutationQuery(parameters, query);
    return graphqlAPI(graphQL, variables);
  },
);

interface GenomicCaseSet {
  filters?: FilterSet;
  caseSetIds?: Record<string, string>;
  status: DataStatus;
  error?: string;
}

const initialState: GenomicCaseSet = {
  status: "uninitialized",
};

const slice = createSlice({
  name: "genomic/genomicCaseSet",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createGenomicCaseSet.fulfilled, (state, action) => {
        const response = action.payload;
        const filters = action.meta.arg.filters;
        if (filters === undefined) {
          console.error(
            "trying to create a case set with no pending filters",
            action.meta.arg.caseSetId,
            action.meta,
          );
        }
        if (response.errors && Object.keys(response.errors).length > 0) {
          // reject the current cohort by setting status to rejected
          return {
            status: "rejected",
            error: response.toString(),
          };
        }
        const data = response.data.sets.create.explore;

        const additionalFilters =
          filters === undefined
            ? {}
            : divideFilterSetByPrefix(filters, REQUIRES_CASE_SET_FILTERS)
                .withoutPrefix.root;

        const caseSetIds = processCaseSetResponse(data);
        const caseSetIntersection = buildCaseSetFilters(caseSetIds);
        const caseSetFilters: FilterSet = {
          mode: "and",
          root: {
            ...caseSetIntersection,
            ...additionalFilters,
          },
        };
        return {
          caseSetIds: caseSetIds,
          filters: caseSetFilters,
          status: "fulfilled",
        };
      })
      .addCase(createGenomicCaseSet.pending, () => {
        return {
          filters: undefined,
          status: "pending",
        };
      })
      .addCase(createGenomicCaseSet.rejected, () => {
        return {
          filters: undefined,
          status: "rejected",
        };
      });
  },
});

export const genomicCaseSetReducer = slice.reducer;

export const selectGenomicCaseSetFilters = (
  state: AppState,
): FilterSet | undefined => state.genomicCaseSet.filters;

export const selectGenomicCaseSetId = (
  state: AppState,
): Record<string, string> | undefined => state.genomicCaseSet.caseSetIds;

export const selectGenomicCaseSetData = (
  state: AppState,
): AppDataSelectorResponse<Record<string, any>> => {
  return {
    data: state.genomicCaseSet.filters,
    status: state.genomicCaseSet.status,
    error: state.genomicCaseSet.error,
  };
};

export const useGenomicCaseSet = createUseAppDataHook(
  createGenomicCaseSet,
  selectGenomicCaseSetData,
);
