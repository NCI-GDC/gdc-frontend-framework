import {
  useMutatedGenesFreqData,
  mutatedGenesFreqReducer,
  MutatedGenesFreqData,
} from "./mutatedGenesFreqSlice";
import { combineReducers } from "@reduxjs/toolkit";

export const downloadsReducer = combineReducers({
  mutatedGenesFreq: mutatedGenesFreqReducer,
});

export { MutatedGenesFreqData, useMutatedGenesFreqData };
