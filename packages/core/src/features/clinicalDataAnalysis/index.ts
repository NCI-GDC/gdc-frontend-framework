import { combineReducers } from "@reduxjs/toolkit";
import {
  useGetClinicalAnalysisQuery,
  clinicalAnalysisApiReducer,
} from "./clinicalDataAnalysisSlice";
import {
  useClinicalFields,
  clinicalFieldsReducer,
} from "./clinicalFieldsSlice";
export { useClinicalFields, useGetClinicalAnalysisQuery };

export const clinicalDataAnalysisReducer = combineReducers({
  fields: clinicalFieldsReducer,
  resultCase: clinicalAnalysisApiReducer,
});
