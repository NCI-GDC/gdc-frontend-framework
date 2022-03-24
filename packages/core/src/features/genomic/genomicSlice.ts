import { combineReducers } from 'redux'
import { genesTableReducer  }from './genesTableSlice';
import { geneFrequencyChartReducer } from './genesFrequencyChartSlice'
import { ssmsTableReducer } from './ssmsTableSlice'
import { genomicFilterReducer } from "./genomicFilters";

export const genomicReducers = combineReducers({
  genesTable: genesTableReducer,
  geneFrequencyChart: geneFrequencyChartReducer,
  ssmsTable: ssmsTableReducer,
  filters: genomicFilterReducer,
})
