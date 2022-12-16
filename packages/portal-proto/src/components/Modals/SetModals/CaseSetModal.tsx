import React, { useState } from "react";
import { useGetCasesQuery, Operation } from "@gff/core";
import InputSet from "./InputSet";
import GenericSetModal from "./GenericSetModal";

interface CaseSetModalProps {
  readonly updateFilters: (field: string, operation: Operation) => void;
}

const CaseSetModal: React.FC<CaseSetModalProps> = ({
  updateFilters,
}: CaseSetModalProps) => {
  const [userEnteredInput, setUserEnteredInput] = useState(false);

  return (
    <GenericSetModal
      modalTitle={"Filter Current Cohort by Cases"}
      tabbed={false}
      userEnteredInput={userEnteredInput}
    >
      <InputSet
        inputInstructions="Enter one or more case identifiers in the field below or upload a file to filter your cohort."
        identifierToolTip={
          <div>
            <p>
              - Case identifiers accepted: Case UUID, Case ID, Sample UUID,
              Sample ID, Portion UUID, Portion ID,
              <p>
                Slide UUID, Slide ID, Analyte UUID, Analyte ID, Aliquot UUID,
                Aliquot ID
              </p>
            </p>
            <p>
              - Delimiters between case identifiers: comma, space, tab or 1 case
              identifier per line
            </p>
            <p>- File formats accepted: .txt, .csv, .tsv</p>{" "}
          </div>
        }
        textInputPlaceholder={
          "e.g. TCGA-DD-AAVP, TCGA-DD-AAVP-10A-01D-A40U-10, 0004d251-3f70-4395-b175-c94c2f5b1b81"
        }
        setType="case"
        setTypeLabel="case"
        // TODO remove case_id from here
        mappedToFields={["submitter_id", "project.project_id", "case_id"]}
        matchAgainstIdentifiers={[
          "case_id",
          "submitter_id",
          "samples.sample_id",
          "samples.submitter_id",
          "samples.portions.portion_id",
          "samples.portions.submitter_id",
          "samples.portions.analytes.analyte_id",
          "samples.portions.analytes.submitter_id",
          "samples.portions.analytes.aliquots.aliquot_id",
          "samples.portions.analytes.aliquots.submitter_id",
          "samples.portions.slides.slide_id",
          "samples.portions.slides.submitter_id",
        ]}
        searchField="case_autocomplete.lowercase"
        fieldDisplay={{
          case_id: "Case UUID",
          submitter_id: "Case ID",
          "project.project_id": "Project",
          "samples.sample_id": "Sample UUID",
          "samples.submitter_id": "Sample ID",
          "samples.portions.portion_id": "Portion UUID",
          "samples.portions.submitter_id": "Portion ID",
          "samples.portions.slides.slide_id": "Slide UUID",
          "samples.portions.slides.submitter_id": "Slide ID",
          "samples.portions.analytes.analyte_id": "Analyte UUID",
          "samples.portions.analytes.submitter_id": "Analyte ID",
          "samples.portions.analytes.aliquots.aliquot_id": "Aliquot UUID",
          "samples.portions.analytes.aliquots.submitter_id": "Aliquot ID",
        }}
        hooks={{
          query: useGetCasesQuery,
          updateFilters: updateFilters,
        }}
        facetField="case.case_id"
        createSetField="case_id"
        setUserEnteredInput={setUserEnteredInput}
        userEnteredInput={userEnteredInput}
      />
    </GenericSetModal>
  );
};

export default CaseSetModal;
