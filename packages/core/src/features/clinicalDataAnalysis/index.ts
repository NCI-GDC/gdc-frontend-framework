import { combineReducers } from "@reduxjs/toolkit";
import {
  useClinicalAnalysis,
  clinicalAnalysisReducer,
  useGetClinicalAnalysisQuery,
  clinicalAnalysisApiReducer,
} from "./clinicalDataAnalysisSlice";
import {
  useClinicalFields,
  clinicalFieldsReducer,
} from "./clinicalFieldsSlice";
export { useClinicalAnalysis, useClinicalFields, useGetClinicalAnalysisQuery };

export const clinicalDataAnalysisReducer = combineReducers({
  result: clinicalAnalysisReducer,
  fields: clinicalFieldsReducer,
  resultCase: clinicalAnalysisApiReducer,
});
