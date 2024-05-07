import { combineReducers } from "redux";
import { genesTableReducer } from "./genesTableSlice";
import { ssmsTableReducer } from "./ssmsTableSlice";
import { genomicFilterReducer } from "./genomicFilters";
import { geneSymbolReducer } from "./geneSymbolSlice";

export const genomicReducers = combineReducers({
  genesTable: genesTableReducer,
  ssmsTable: ssmsTableReducer,
  filters: genomicFilterReducer,
  geneSymbols: geneSymbolReducer,
});
