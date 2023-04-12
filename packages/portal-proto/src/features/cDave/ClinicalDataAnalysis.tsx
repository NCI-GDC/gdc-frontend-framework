import { useEffect, useState } from "react";
import { LoadingOverlay } from "@mantine/core";
import {
  useCoreSelector,
  buildCohortGqlOperator,
  useClinicalAnalysis,
  useClinicalFields,
  selectCurrentCohortFilters,
} from "@gff/core";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import Controls from "./Controls";
import Dashboard from "./Dashboard";
import { DEFAULT_FIELDS, FACET_SORT } from "./constants";
import { filterUsefulFacets, parseFieldName } from "./utils";
import { DemoText } from "../shared/tailwindComponents";

export interface ClinicalDataAnalysisProps {
  onLoaded?: () => void;
}

const ClinicalDataAnalysis: React.FC<ClinicalDataAnalysisProps> = ({
  onLoaded,
}: ClinicalDataAnalysisProps) => {
  const isDemoMode = useIsDemoApp();
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
    buildCohortGqlOperator(
      isDemoMode
        ? {
            mode: "and",
            root: {
              "cases.project.project_id": {
                operator: "includes",
                field: "cases.project.project_id",
                operands: ["TCGA-LGG"],
              },
            },
          }
        : selectCurrentCohortFilters(state),
    ),
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
    <div className="flex relative justify-center items-center h-screen/2">
      <LoadingOverlay
        loaderProps={{ size: "xl", color: "primary" }}
        visible={isFetching}
        data-testid="please_wait_spinner"
      />
    </div>
  ) : (
    <>
      {isDemoMode && (
        <DemoText>
          Demo showing cases with low grade gliomas (TCGA-LGG project).
        </DemoText>
      )}

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
    </>
  );
};

export default ClinicalDataAnalysis;
