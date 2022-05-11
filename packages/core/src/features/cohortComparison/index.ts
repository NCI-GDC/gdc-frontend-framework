import {
  useCohortFacets,
  CohortFacet,
  CohortFacetDoc,
  cohortFacetsReducer,
} from "./cohortFacetSlice";
import {
  cohortVennDiagramReducer,
  useVennIntersectionData,
} from "./vennDiagramSlice";
import { fetchPValue } from "./pValueApi";
import { combineReducers } from "@reduxjs/toolkit";

export const cohortComparisonReducer = combineReducers({
  facets: cohortFacetsReducer,
  venn: cohortVennDiagramReducer,
});

export {
  useCohortFacets,
  fetchPValue,
  CohortFacet,
  CohortFacetDoc,
  useVennIntersectionData,
};
