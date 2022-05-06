import { combineReducers } from "redux";
import { genesFacetReducer } from "./genesFacetSliceGQL";
import { caseFacetsReducer } from "./casesFacetSliceGQL";
import { fileFacetsReducer } from "./filesFacetSliceGQL";
import { mutationsFacetReducer } from "./mutationFacetSliceGQL";
import { rangeFacetsReducer } from "./continuousAggregationSlice";

export const fileCaseGenesMutationsFacetReducers = combineReducers({
  cases: caseFacetsReducer,
  files: fileFacetsReducer,
  genes: genesFacetReducer,
  ssms: mutationsFacetReducer,
  ranges: rangeFacetsReducer,
});
