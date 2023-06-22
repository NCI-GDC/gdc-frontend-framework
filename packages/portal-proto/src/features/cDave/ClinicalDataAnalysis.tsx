import React, { useState } from "react";
import { LoadingOverlay } from "@mantine/core";
import {
  useCoreSelector,
  buildCohortGqlOperator,
  useClinicalFields,
  useGetClinicalAnalysisQuery,
  selectCurrentCohortFilters,
} from "@gff/core";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import Controls from "./Controls";
import Dashboard from "./Dashboard";
import { DEFAULT_FIELDS, DEMO_COHORT_FILTERS, FACET_SORT } from "./constants";
import { filterUsefulFacets, parseFieldName } from "./utils";
import { DemoText } from "../shared/tailwindComponents";

const ClinicalDataAnalysis: React.FC = () => {
  const isDemoMode = useIsDemoApp();
  const [controlsExpanded, setControlsExpanded] = useState(true);
  const [activeFields, setActiveFields] = useState(DEFAULT_FIELDS); // the fields that have been selected by the user

  const { data: fields } = useClinicalFields();

  const cDaveFields = Object.values(fields)
    .map((d) => ({ ...d, ...parseFieldName(d.name) }))
    .filter(
      (d) =>
        FACET_SORT?.[d.field_type] &&
        FACET_SORT[d.field_type].includes(d.field_name),
    );

  const cohortFilters = useCoreSelector((state) =>
    buildCohortGqlOperator(
      isDemoMode ? DEMO_COHORT_FILTERS : selectCurrentCohortFilters(state),
    ),
  );
  const {
    data: cDaveResult,
    isFetching,
    isSuccess,
  } = useGetClinicalAnalysisQuery({
    case_filters: cohortFilters,
    facets: cDaveFields.map((f) => f.full),
    size: 0,
  });

  const updateFields = (field: string) => {
    if (activeFields.includes(field)) {
      setActiveFields(activeFields.filter((f) => f !== field));
    } else {
      setActiveFields([...activeFields, field]);
    }
  };

  return isFetching ? (
    <div className="flex relative justify-center items-center h-screen/2">
      <LoadingOverlay
        loaderProps={{ size: "xl", color: "primary" }}
        visible={isFetching}
        data-testid="please_wait_spinner"
        zIndex={0}
      />
    </div>
  ) : (
    <>
      {isDemoMode && (
        <DemoText>
          Demo showing cases with low grade gliomas (TCGA-LGG project).
        </DemoText>
      )}

      <div className="flex gap-4">
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
    </>
  );
};

export default ClinicalDataAnalysis;
