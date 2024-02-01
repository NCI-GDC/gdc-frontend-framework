import { combineReducers } from "redux";
import { genesTableReducer } from "./genesTableSlice";
import { geneFrequencyChartReducer } from "./genesFrequencyChartSlice";
import { ssmsTableReducer } from "./ssmsTableSlice";
import { genomicFilterReducer } from "./genomicFilters";
import { geneSymbolReducer } from "./geneSymbolSlice";
import { ssmsConsequenceTableReducer } from "./ssmsConsequenceTableSlice";

export const genomicReducers = combineReducers({
  genesTable: genesTableReducer,
  geneFrequencyChart: geneFrequencyChartReducer,
  ssmsTable: ssmsTableReducer,
  ssmsConsequenceTable: ssmsConsequenceTableReducer,
  filters: genomicFilterReducer,
  geneSymbols: geneSymbolReducer,
});
