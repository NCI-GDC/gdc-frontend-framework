import { combineReducers } from "redux";
import { ssmsTableReducer } from "./ssmsTableSlice";
import { genomicFilterReducer } from "./genomicFilters";
import { geneSymbolReducer } from "./geneSymbolSlice";

export const genomicReducers = combineReducers({
  ssmsTable: ssmsTableReducer,
  filters: genomicFilterReducer,
  geneSymbols: geneSymbolReducer,
});
