import { combineReducers } from "@reduxjs/toolkit";
import {
  useGetClinicalAnalysisQuery,
  clinicalAnalysisApiReducer,
} from "./clinicalDataAnalysisSlice";
import {
  fetchClinicalFieldsResult,
  useClinicalFields,
  clinicalFieldsReducer,
} from "./clinicalFieldsSlice";
export {
  fetchClinicalFieldsResult,
  useClinicalFields,
  useGetClinicalAnalysisQuery,
};

export const clinicalDataAnalysisReducer = combineReducers({
  fields: clinicalFieldsReducer,
  resultCase: clinicalAnalysisApiReducer,
});
