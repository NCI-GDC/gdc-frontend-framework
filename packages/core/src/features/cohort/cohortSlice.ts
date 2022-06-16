import { combineReducers } from "redux";
import { cohortFilterReducer } from "./cohortFilterSlice";
import { cohortNameReducer } from "./cohortNameSlice";
import { cohortCountsReducer } from "./countSlice";
import { availableCohortsReducer } from "./availableCohortsSlice";
import { cohortBuilderConfigReducer } from "./cohortBuilderConfigSlice";

export const cohortReducers = combineReducers({
  currentCohort: cohortNameReducer,
  currentFilters: cohortFilterReducer,
  counts: cohortCountsReducer,
  availableCohorts: availableCohortsReducer,
  builderConfig: cohortBuilderConfigReducer,
});
