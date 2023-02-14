import { useEffect, useState } from "react";
import { Loader } from "@mantine/core";
import {
  useCoreSelector,
  buildCohortGqlOperator,
  useClinicalAnalysis,
  useClinicalFields,
  selectCurrentCohortFilters,
} from "@gff/core";
import Controls from "./Controls";
import Dashboard from "./Dashboard";
import { DEFAULT_FIELDS, FACET_SORT } from "./constants";
import { filterUsefulFacets, parseFieldName } from "./utils";

export interface ClinicalDataAnalysisProps {
  onLoaded?: () => void;
}

const ClinicalDataAnalysis: React.FC<ClinicalDataAnalysisProps> = ({
  onLoaded,
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
    buildCohortGqlOperator(selectCurrentCohortFilters(state)),
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

  useEffect(() => {
    if (!isFetching) {
      onLoaded && onLoaded();
    }
  }, [isFetching, onLoaded]);

  return isFetching ? (
    <Loader size={80} data-testid="please_wait_spinner" />
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
