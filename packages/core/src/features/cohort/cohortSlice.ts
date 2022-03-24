import { combineReducers } from 'redux'
import { cohortFilterReducer  }from './cohortFilterSlice';
import { cohortNameReducer } from './cohortNameSlice'
import { cohortCountsReducer } from './countSlice'

export const cohortReducers = combineReducers({
  currentCohort: cohortNameReducer,
  currentFilters: cohortFilterReducer,
  counts: cohortCountsReducer
})
