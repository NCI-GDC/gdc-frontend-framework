import MetaSearch from "../cohortBuilder/MetaSearch";
import CohortTabbedFacets from "../cohortBuilder/FacetGroup";
import { FC } from "react";

const CohortBuilder: FC = () => {
  return (
    <div className="flex flex-col">
      <MetaSearch />
      <CohortTabbedFacets />
    </div>
  );
};

export default CohortBuilder;
