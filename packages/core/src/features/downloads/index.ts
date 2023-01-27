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
};
