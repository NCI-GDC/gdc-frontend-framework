import { useState } from "react";
import { Loader } from "@mantine/core";
import {
  useCoreSelector,
  selectAvailableCohortByName,
  buildCohortGqlOperator,
  useClinicalAnalysis,
  useClinicalFields,
} from "@gff/core";
import Controls from "./Controls";
import Dashboard from "./Dashboard";
import { DEFAULT_FIELDS, FACET_SORT } from "./constants";
import { filterUsefulFacets, parseFieldName } from "./utils";

interface ClinicalDataAnalysisProps {
  readonly cohort: string;
}

const ClinicalDataAnalysis: React.FC<ClinicalDataAnalysisProps> = ({
  cohort,
}: ClinicalDataAnalysisProps) => {
  const [controlsExpanded, setControlsExpanded] = useState(true);
  const [activeFields, setActiveFields] = useState(DEFAULT_FIELDS);

  const { data: fields } = useClinicalFields();
  const cDaveFields = Object.values(fields)
    .map((d) => ({ ...d, ...parseFieldName(d.name) }))
    .filter(
      (d) =>
        FACET_SORT?.[d.field_type] &&
        FACET_SORT[d.field_type].includes(d.field_name),
    );

  const cohortFilters = useCoreSelector((state) =>
    buildCohortGqlOperator(selectAvailableCohortByName(state, cohort).filters),
  );
  const {
    data: cDaveResult,
    isFetching,
    isSuccess,
  } = useClinicalAnalysis({
    filters: cohortFilters,
    facets: cDaveFields.map((f) => f.full),
  });

  const updateFields = (field: string) => {
    if (activeFields.includes(field)) {
      setActiveFields(activeFields.filter((f) => f !== field));
    } else {
      setActiveFields([...activeFields, field]);
    }
  };

  return isFetching ? (
    <Loader size={80} />
  ) : (
    <div className="flex">
      <Controls
        updateFields={updateFields}
        cDaveFields={cDaveFields}
        fieldsWithData={filterUsefulFacets(cDaveResult)}
        activeFields={activeFields}
        controlsExpanded={controlsExpanded}
        setControlsExpanded={setControlsExpanded}
      />
      {isSuccess && Object.keys(cDaveResult).length > 0 && (
        <Dashboard
          activeFields={activeFields}
          cohortFilters={cohortFilters}
          results={cDaveResult}
          updateFields={updateFields}
          controlsExpanded={controlsExpanded}
        />
      )}
    </div>
  );
};

export default ClinicalDataAnalysis;
