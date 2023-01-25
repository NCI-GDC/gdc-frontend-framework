import {
  useMutatedGenesFreqData,
  mutatedGenesFreqReducer,
  MutatedGenesFreqData,
} from "./mutatedGenesFreqSlice";
import {
  useMutationsFreqData,
  mutationsFreqReducer,
  MutationsFreqData,
} from "./mutationsFreqSlice";
import { combineReducers } from "@reduxjs/toolkit";

export const downloadsReducer = combineReducers({
  mutatedGenesFreq: mutatedGenesFreqReducer,
  mutationsFreq: mutationsFreqReducer,
});

export {
  MutatedGenesFreqData,
  useMutatedGenesFreqData,
  MutationsFreqData,
  useMutationsFreqData,
};
