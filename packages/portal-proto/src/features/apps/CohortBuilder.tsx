import MetaSearch from "../cohortBuilder/MetaSearch";
import FacetTabs from "../cohortBuilder/FacetTabs";
import { FC } from "react";

const CohortBuilder: FC = () => {
  return (
    <div className="flex flex-col">
      <MetaSearch />
      <FacetTabs />
    </div>
  );
};

export default CohortBuilder;
