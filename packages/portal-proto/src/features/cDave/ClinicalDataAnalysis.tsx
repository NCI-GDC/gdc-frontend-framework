import { useState } from "react";
import {
  useCoreSelector,
  selectAvailableCohortByName,
  buildCohortGqlOperator,
  useFacetDictionary,
  useClinicalAnalysis,
} from "@gff/core";
import Controls from "./Controls";
import Dashboard from "./Dashboard";
import { DEFAULT_FIELDS } from "./constants";

const parseFieldName = (field) => {
  const parsed = field.split(".");
  return { field_type: parsed.at(-2), field_name: parsed.at(-1) };
};

const tabs = ["demographic", "diagnoses", "exposures", "treatments"];

export const CLINICAL_FIELD_BLACKLIST = [
  "state",
  "score",
  "submitter_id",
  "demographic_id",
  "updated_datetime",
  "diagnosis_id",
  "created_datetime",
  "exposure_id",
  "treatment_id",
];
const blacklistRegex = new RegExp(
  CLINICAL_FIELD_BLACKLIST.map((item) => `(${item})`).join("|"),
);

interface ClinicalDataAnalysisProps {
  readonly cohort: string;
}

const ClinicalDataAnalysis: React.FC<ClinicalDataAnalysisProps> = ({
  cohort,
}: ClinicalDataAnalysisProps) => {
  const { data } = useFacetDictionary();

  const cDaveFields = Object.values(data)
    .map((d) => ({ ...d, ...parseFieldName(d.field) }))
    .filter((d) => d.doc_type === "cases" && tabs.includes(d.field_type))
    .filter((field) => !blacklistRegex.test(field.field));

  const [activeFields, setActiveFields] = useState(DEFAULT_FIELDS);

  const cohortFilters = useCoreSelector((state) =>
    buildCohortGqlOperator(selectAvailableCohortByName(state, cohort).filters),
  );

  const { data: cDaveResult } = useClinicalAnalysis({
    filters: cohortFilters,
    facets: cDaveFields.map((f) => f.field),
  });

  console.log("result", cDaveResult);

  const updateFields = (field: string) => {
    if (activeFields.includes(field)) {
      setActiveFields(activeFields.filter((f) => f !== field));
    } else {
      setActiveFields([...activeFields, field]);
    }
  };

  return (
    <div className="flex">
      <Controls
        updateFields={updateFields}
        cDaveFields={cDaveFields}
        numFieldsWithData={Object.keys(cDaveResult).length}
      />
      <Dashboard
        activeFields={activeFields}
        cohortFilters={cohortFilters}
        results={cDaveResult}
      />
    </div>
  );
};

export default ClinicalDataAnalysis;
