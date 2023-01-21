import React from "react";
import { useGetCasesQuery } from "@gff/core";
import InputSet from "./InputSet";
import GenericSetModal from "./GenericSetModal";
import { InputModalProps } from "./types";

const CaseSetModal: React.FC<InputModalProps> = ({
  updateFilters,
  existingFiltersHook,
  useAddNewFilterGroups,
}: InputModalProps) => {
  return (
    <GenericSetModal
      modalTitle={"Filter Current Cohort by Cases"}
      tabbed={false}
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
        setType="cases"
        setTypeLabel="case"
        hooks={{
          query: useGetCasesQuery,
          updateFilters: updateFilters,
          getExistingFilters: existingFiltersHook,
        }}
        useAddNewFilterGroups={useAddNewFilterGroups}
      />
    </GenericSetModal>
  );
};

export default CaseSetModal;
