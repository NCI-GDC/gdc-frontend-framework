import { useCohortFacetsQuery, CohortFacetDoc } from "./cohortFacetSlice";
import {
  cohortVennDiagramReducer,
  useVennIntersectionData,
} from "./vennDiagramSlice";
import { fetchPValue } from "./pValueApi";
import { combineReducers } from "@reduxjs/toolkit";

export const cohortComparisonReducer = combineReducers({
  venn: cohortVennDiagramReducer,
});

export {
  useCohortFacetsQuery,
  CohortFacetDoc,
  fetchPValue,
  useVennIntersectionData,
};
