import { combineReducers } from "@reduxjs/toolkit";
import {
  useGetClinicalAnalysisQuery,
  clinicalAnalysisApiReducer,
} from "./clinicalDataAnalysisSlice";
import { useClinicalFieldsQuery } from "./clinicalFieldsSlice";
import {
  useGetContinuousDataStatsQuery,
  ClinicalContinuousStatsData,
} from "./clinicalContinuousStatsSlice";

export {
  useClinicalFieldsQuery,
  useGetClinicalAnalysisQuery,
  useGetContinuousDataStatsQuery,
  ClinicalContinuousStatsData,
};

export const clinicalDataAnalysisReducer = combineReducers({
  resultCase: clinicalAnalysisApiReducer,
});
