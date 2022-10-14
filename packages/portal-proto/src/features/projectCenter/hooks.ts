import { UpdateFacetFilterFunction } from "@/features/facets/types";
import {
  useAppDispatch,
  useAppSelector,
} from "@/features/repositoryApp/appApi";
import { Operation } from "@gff/core";
import {
  selectFiltersByName,
  updateProjectFilter,
} from "@/features/projectCenter/projectCenterFiltersSlice";

export const useUpdateProjectFacetFilter = (): UpdateFacetFilterFunction => {
  const dispatch = useAppDispatch();
  // update the filter for this facet
  return (field: string, operation: Operation) => {
    dispatch(updateProjectFilter({ field: field, operation: operation }));
  };
};

//  Selector Hooks for getting repository filters by name
export const useSelectFieldFilter = (field: string): Operation => {
  return useAppSelector((state) => selectFiltersByName(state, field));
};
