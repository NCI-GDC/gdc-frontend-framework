import { combineReducers } from "redux";
// import { cohortFilterReducer } from "./cohortFilterSlice";
// import { cohortNameReducer } from "./cohortNameSlice";
import { cohortCountsReducer } from "./countSlice";
import { availableCohortsReducer } from "./availableCohortsSlice";
import { comparisonCohortsReducer } from "./comparisonCohortsSlice";
import { cohortBuilderConfigReducer } from "./cohortBuilderConfigSlice";
// import { caseSetReducer } from "./caseSetSlice";

export const cohortReducers = combineReducers({
  // currentCohort: cohortNameReducer,
  // currentFilters: cohortFilterReducer,
  // caseSet: caseSetReducer,

  availableCohorts: availableCohortsReducer,
  comparisonCohorts: comparisonCohortsReducer,
  builderConfig: cohortBuilderConfigReducer,
  counts: cohortCountsReducer,
});
