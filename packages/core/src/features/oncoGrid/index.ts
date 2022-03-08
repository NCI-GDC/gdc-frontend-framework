import { combineReducers } from "@reduxjs/toolkit";
import { casesReducer, useOncoGridCases } from "./casesSlice";
import {
  genesReducer, useOncoGridGenes
} from "./genesSlice";
import {
  ssmOccurrencesReducer,
} from "./ssmOccurrencesSlice";
import { cnvOccurrencesReducer} from "./cnvOccurrencesSlice";

export const oncoGridReducer = combineReducers({
  genes: genesReducer,
  cases: casesReducer,
  ssmOccurrences: ssmOccurrencesReducer,
  cnvOccurrences: cnvOccurrencesReducer,
});

export { useOncoGridCases, useOncoGridGenes };
