import { combineReducers } from "@reduxjs/toolkit";
import {
  useClinicalAnalysis,
  clinicalAnalysisReducer,
} from "./clinicalDataAnalysisSlice";
import {
  useClinicalFields,
  clinicalFieldsReducer,
} from "./clinicalFieldsSlice";
export { useClinicalAnalysis, useClinicalFields };

export const clinicalDataAnalysisReducer = combineReducers({
  result: clinicalAnalysisReducer,
  fields: clinicalFieldsReducer,
});
