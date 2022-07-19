import { useEffect, useState } from "react";
import FacetSelection from "@/components/FacetSelection";
import {
  usePrevious,
  selectCohortBuilderConfigFilters,
  useCoreSelector,
  useFacetDictionary,
} from "@gff/core";
import isEqual from "lodash/isEqual";

const CohortFacetSelection = () => {
  // get the current list of cohort filters
  const cohortBuilderFilters = useCoreSelector((state) =>
    selectCohortBuilderConfigFilters(state),
  );
  const { data, isSuccess } = useFacetDictionary();
  const [availableFilters, setAvailableFilters] = useState(undefined);
  const prevCohortBuilderFilters = usePrevious(cohortBuilderFilters);
  const prevData = usePrevious(data);

  const handleFilterSelected = (facet: string) => {
    console.log("facetSelected", facet);
  };

  const handleUsefulFiltersChanges = (useUseful: boolean) => {
    console.log("facetSelected", useUseful);
  };

  useEffect(() => {
    if (
      !isEqual(prevData, data) ||
      !isEqual(prevCohortBuilderFilters, cohortBuilderFilters)
    ) {
      const f = Object.values(data)
        .filter((x) => {
          return x.full.startsWith("cases");
        })
        .filter((x) => {
          return !cohortBuilderFilters.includes(x.full);
        });

      setAvailableFilters(f);
    }
  }, [cohortBuilderFilters, isSuccess, data, prevCohortBuilderFilters]);

  return (
    <FacetSelection
      title={"Add Cohort Filter"}
      filters={availableFilters}
      handleFilterSelected={handleFilterSelected}
      handleFilteredWithValuesChanged={handleUsefulFiltersChanges}
    />
  );
};

export default CohortFacetSelection;
