import React from "react";
import { useCreateCaseSetFromValuesMutation } from "@gff/core";
import InputEntityList from "@/components/InputEntityList/InputEntityList";
import UserInputModal from "../UserInputModal";
import { InputModalProps } from "./types";
import UpdateCohortButton from "./UpdateFiltersButton";

const CaseSetModal: React.FC<InputModalProps> = ({
  updateFilters,
  existingFiltersHook,
  opened,
}: InputModalProps) => {
  return (
    <UserInputModal
      modalTitle={"Filter Current Cohort by Cases"}
      opened={opened}
    >
      <InputEntityList
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
        entityType="cases"
        entityLabel="case"
        hooks={{
          createSet: useCreateCaseSetFromValuesMutation,
          updateFilters: updateFilters,
          getExistingFilters: existingFiltersHook,
        }}
        RightButton={UpdateCohortButton}
      />
    </UserInputModal>
  );
};

export default CaseSetModal;
