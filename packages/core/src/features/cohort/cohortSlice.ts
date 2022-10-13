import { combineReducers } from "redux";
import { cohortCountsReducer } from "./countSlice";
import { availableCohortsReducer } from "./availableCohortsSlice";
import { comparisonCohortsReducer } from "./comparisonCohortsSlice";
import { cohortBuilderConfigReducer } from "./cohortBuilderConfigSlice";

export const cohortReducers = combineReducers({
  availableCohorts: availableCohortsReducer,
  comparisonCohorts: comparisonCohortsReducer,
  builderConfig: cohortBuilderConfigReducer,
  cohortCounts: cohortCountsReducer,
});
