import React, { useState } from "react";
import { CohortGroup, CohortGroupProps } from "./CohortGroup";
import { SummaryCharts } from "./SummaryCharts";
import MetaSearch from "./MetaSearch";
import CohortTabbedFacets from "./FacetGroup";

const FullCohortBuilder: React.FC<CohortGroupProps> = ({
  cohorts,
  simpleMode = false,
}: CohortGroupProps) => {
  const [summaryFields] = useState([
    "primary_site",
    "demographic.gender",
    "disease_type",
    "diagnoses.tissue_or_organ_of_origin",
  ]);

  return (
    <div className="bg-white">
      <CohortGroup cohorts={cohorts} simpleMode={simpleMode} />
      <MetaSearch />
      <SummaryCharts fields={summaryFields} />
      <CohortTabbedFacets />
    </div>
  );
};

export default FullCohortBuilder;
