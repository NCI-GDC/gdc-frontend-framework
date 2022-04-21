import MetaSearch from "../cohortBuilder/MetaSearch";
import CohortTabbedFacets from "../cohortBuilder/FacetGroup";

const CohortBuilder = () => {
  return (
    <div className="flex flex-col">
      <MetaSearch />
      <CohortTabbedFacets />
    </div>
  );
};

export default CohortBuilder;
