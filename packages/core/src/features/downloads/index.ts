import {
  useMutatedGenesFreqData,
  mutatedGenesFreqReducer,
  MutatedGenesFreqData,
} from "./json/mutatedGenesFreqSlice";
import {
  useMutationsFreqData,
  mutationsFreqReducer,
  MutationsFreqData,
} from "./json/mutationsFreqSlice";
import { combineReducers } from "@reduxjs/toolkit";
import {
  useGetGeneTableSubrowQuery,
  useGetSomaticMutationTableSubrowQuery,
  useMutationsFreqDLQuery,
  useMutatedGenesFreqDLQuery,
  TableSubrowData,
} from "./tsv/tableSubrow";
import {
  CDTableGeneSummaryData,
  useGetCDTableGeneSummaryDLQuery,
} from "./tsv/cancerDistribution/summary";

export const downloadsReducer = combineReducers({
  // json downloads
  mutatedGenesFreq: mutatedGenesFreqReducer,
  mutationsFreq: mutationsFreqReducer,
});

export {
  MutatedGenesFreqData,
  useMutatedGenesFreqData,
  MutationsFreqData,
  useMutationsFreqData,
  // subrow
  useGetGeneTableSubrowQuery,
  useGetSomaticMutationTableSubrowQuery,
  // tsv downloads
  useMutatedGenesFreqDLQuery,
  useMutationsFreqDLQuery,
  TableSubrowData,
  useGetCDTableGeneSummaryDLQuery,
  CDTableGeneSummaryData,
};
