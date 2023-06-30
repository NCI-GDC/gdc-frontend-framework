import { combineReducers } from "redux";
import { cohortCountsReducer } from "./countSlice";
import { availableCohortsReducer } from "./availableCohortsSlice";
import { cohortBuilderConfigReducer } from "./cohortBuilderConfigSlice";

export const cohortReducers = combineReducers({
  availableCohorts: availableCohortsReducer,
  builderConfig: cohortBuilderConfigReducer,
  cohortCounts: cohortCountsReducer,
});
