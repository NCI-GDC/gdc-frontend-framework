import {
  useMutatedGenesFreq,
  mutatedGenesFreqReducer,
} from "./mutatedGenesFreqSlice";
import { combineReducers } from "@reduxjs/toolkit";

export const downloadsReducer = combineReducers({
  mutatedGenes: mutatedGenesFreqReducer,
});

export { useMutatedGenesFreq };
