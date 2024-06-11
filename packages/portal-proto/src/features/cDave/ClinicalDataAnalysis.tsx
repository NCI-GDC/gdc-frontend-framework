import React, { useState } from "react";
import { LoadingOverlay } from "@mantine/core";
import {
  useCoreSelector,
  buildCohortGqlOperator,
  useClinicalFieldsQuery,
  useGetClinicalAnalysisQuery,
  selectCurrentCohortFilters,
} from "@gff/core";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import Controls from "./Controls";
import Dashboard from "./Dashboard";
import { DEFAULT_FIELDS, DEMO_COHORT_FILTERS, FACET_SORT } from "./constants";
import { filterUsefulFacets, parseFieldName } from "./utils";
import { DemoText } from "@/components/tailwindComponents";
import { useDeepCompareCallback, useDeepCompareMemo } from "use-deep-compare";

const ClinicalDataAnalysis: React.FC = () => {
  const isDemoMode = useIsDemoApp();
  const [controlsExpanded, setControlsExpanded] = useState(true);
  const [activeFields, setActiveFields] = useState(DEFAULT_FIELDS); // the fields that have been selected by the user

  const { data: fields } = useClinicalFieldsQuery();

  const cDaveFields = useDeepCompareMemo(
    () =>
      Object.values(fields || {})
        .map((d) => ({ ...d, ...parseFieldName(d.name) }))
        .filter(
          (d) =>
            FACET_SORT?.[d.field_type] &&
            FACET_SORT[d.field_type].includes(d.field_name),
        ),
    [fields],
  );

  console.log({ cDaveFields });

  const currentCohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );

  const cohortFilters = useDeepCompareMemo(
    () =>
      buildCohortGqlOperator(
        isDemoMode ? DEMO_COHORT_FILTERS : currentCohortFilters,
      ),
    [isDemoMode, currentCohortFilters],
  );
  const facets = useDeepCompareMemo(
    () => cDaveFields.map((f) => f.full),
    [cDaveFields],
  );

  const {
    data: cDaveResult,
    isFetching,
    isSuccess,
  } = useGetClinicalAnalysisQuery({
    case_filters: cohortFilters,
    facets,
    size: 0,
  });

  const updateFields = useDeepCompareCallback(
    (field: string) => {
      if (activeFields.includes(field)) {
        setActiveFields(activeFields.filter((f) => f !== field));
      } else {
        setActiveFields([...activeFields, field]);
      }
    },
    [activeFields],
  );

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
