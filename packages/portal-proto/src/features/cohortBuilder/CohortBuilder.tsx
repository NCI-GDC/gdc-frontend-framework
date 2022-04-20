import { useState } from "react";
import { CohortGroup, CohortGroupProps } from "./CohortGroup";
import { SummaryCharts } from "./SummaryCharts";
import MetaSearch from "./MetaSearch";
import CohortTabbedFacets from "./FacetGroup";

const FullCohortBuilder: React.FC<CohortGroupProps> = ({
  cohorts,
  simpleMode = false,
}: CohortGroupProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchResults, setSearchResults] = useState([]);

  // TODO can be varible instead of state if no use of the setter
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [summaryFields, setSummaryFields] = useState([
    "primary_site",
    "demographic.gender",
    "disease_type",
    "diagnoses.tissue_or_organ_of_origin",
  ]);
  return (
    <div className="bg-white">
      <CohortGroup cohorts={cohorts} simpleMode={simpleMode} />
      <MetaSearch onChange={(r) => setSearchResults(r)} />
      <SummaryCharts fields={summaryFields} />
      <CohortTabbedFacets />
    </div>
  );
};

export default FullCohortBuilder;
