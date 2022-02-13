import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoreState } from "../../store";
import {
  GqlGreaterThan,  GqlIncludes,
  GqlOperation,
} from "../gdcapi/filters";

export interface EnumFilter {
  type: "enum";
  readonly field: string;
  readonly op: string;
  readonly values: string[];
}

export interface RangeFilter {
  type: "range";
  readonly field: string;
  readonly op: string;
  readonly from: number;
  readonly to: number;
}

export type CohortFilter = EnumFilter | RangeFilter;

export interface FilterSet {
  readonly root: Record<string, CohortFilter>;
  readonly mode: string;
}

export interface CohortState {
  readonly currentCohort?: string;
  readonly currentFilters: FilterSet;
}

const initialState: CohortState = { currentFilters: { mode: "and", root: {} } };

const slice = createSlice({
  name: "cohort",
  initialState,
  reducers: {
    setCurrentCohort: (state, action: PayloadAction<string>) => {
      state.currentCohort = action.payload;
    },
    clearCurrentCohort: (state) => {
      state.currentCohort = undefined;
    },
    updateCohortFilter: (state, action: PayloadAction<CohortFilter>) => {
       return {
         ...state,
         currentFilters: {
        mode: "and",
        root: { ...state.currentFilters.root, [action.payload.field]: action.payload },
      }};
    },
    removeCohortFilter: (state, action: PayloadAction<string>)  => {
      console.log("removeCohortFilter");
      const { [action.payload]: _, ...updated} = state.currentFilters.root;
      return {
        ...state,
        currentFilters: {
          mode: "and",
          root: updated,
        }};
    },
    clearCohortFilters: (state) => {
      state.currentFilters = { mode: "and", root: {} };
    },
  },
  extraReducers: {},
});

export interface CohortFilterHandler<T> {
  handleEnum: (op: EnumFilter) => T;
  handleRange: (op: RangeFilter) => T;
}

const assertNever = (x: never): never => {
  throw Error(`Exhaustive comparison did not handle: ${x}`);
};

export const handleGqlOperation = <T>(
  handler: CohortFilterHandler<T>,
  filter: CohortFilter,
): T => {
  switch (filter.type) {
    case "enum":
      return handler.handleEnum(filter);
    case "range":
      return handler.handleRange(filter);
    default:
      return assertNever(filter);
  }
};

class CohortFilterToGqlOperationHandler implements CohortFilterHandler<GqlOperation> {
  handleEnum = (op: EnumFilter): GqlIncludes => ({
    op: "in",
    content: {
      field: op.field,
      value: op.values,
    },
  });
  handleRange = (op: RangeFilter): GqlGreaterThan => ({
    op: ">",
    content: {
      field: op.field,
      value: op.from,
    },
  });
}

export const convertFacetFilterToGqlFilter = (filter: CohortFilter): GqlOperation => {
  const handler: CohortFilterHandler<GqlOperation> = new CohortFilterToGqlOperationHandler();
  return handleGqlOperation(handler, filter);
};

const buildCohortGqlOperator = (fs: FilterSet | undefined): GqlOperation | undefined => {

  if (!fs)
    return undefined;
  switch (fs.mode) {
    case "and":
      return (
        (Object.keys(fs.root).length == 0) ? undefined :
        {
          op: "and", content: Object.keys(fs.root).map((k): GqlOperation => {
            return convertFacetFilterToGqlFilter(fs.root[k]);
          }),
        }
      );
  }
  return undefined;
};

export const cohortReducer = slice.reducer;
export const { setCurrentCohort, clearCurrentCohort, updateCohortFilter, removeCohortFilter, clearCohortFilters } = slice.actions;


export const selectCurrentCohort = (state: CoreState): string | undefined =>
  state.cohort.currentCohort;

export const selectCurrentCohortFilters = (state: CoreState): FilterSet | undefined =>
  state.cohort.currentFilters;

export const selectCurrentCohortGqlFilters = (state: CoreState): GqlOperation | undefined => {
  return buildCohortGqlOperator(state.cohort.currentFilters);
};

export const selectCurrentCohortFiltersByName = (state: CoreState, name: string): CohortFilter | undefined =>
  state.cohort.currentFilters?.root[name];



