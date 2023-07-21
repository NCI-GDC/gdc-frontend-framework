import { combineReducers } from "@reduxjs/toolkit";
import {
  useGetClinicalAnalysisQuery,
  clinicalAnalysisApiReducer,
  useGetContinuousDataStatsQuery,
  ClinicalContinuousStatsData,
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
  useGetContinuousDataStatsQuery,
  ClinicalContinuousStatsData,
};

export const clinicalDataAnalysisReducer = combineReducers({
  fields: clinicalFieldsReducer,
  resultCase: clinicalAnalysisApiReducer,
});
