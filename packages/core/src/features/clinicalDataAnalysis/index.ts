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
import {
  useGetContinuousDataStatsQuery,
  ClinicalContinuousStatsData,
} from "./clinicalContinuousStatsSlice";

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
