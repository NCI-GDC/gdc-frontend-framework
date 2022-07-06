import { combineReducers } from "redux";
import { cohortFilterReducer } from "./cohortFilterSlice";
import { cohortNameReducer } from "./cohortNameSlice";
import { cohortCountsReducer } from "./countSlice";
import { availableCohortsReducer } from "./availableCohortsSlice";
import { comparisonCohortsReducer } from "./comparisonCohortsSlice";
import { cohortBuilderConfigReducer } from "./cohortBuilderConfigSlice";

export const cohortReducers = combineReducers({
  currentCohort: cohortNameReducer,
  currentFilters: cohortFilterReducer,
  counts: cohortCountsReducer,
  availableCohorts: availableCohortsReducer,
  comparisonCohorts: comparisonCohortsReducer,
  builderConfig: cohortBuilderConfigReducer,
});
